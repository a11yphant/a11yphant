import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import {
  CHALLENGE,
  ChallengeData,
  CODE_LEVEL,
  CODE_LEVEL_SUBMISSION,
  CodeLevelData,
  CodeLevelSubmissionData,
  Factory,
  QUIZ_LEVEL,
  QUIZ_LEVEL_SUBMISSION,
  QuizLevelData,
  QuizLevelSubmissionData,
  USER,
  UserData,
} from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";

import { LevelStatus } from "@/challenge/enums/level-status.enum";
import { LevelService } from "@/challenge/level.service";
import { ResultStatus } from "@/submission/graphql/models/result-status.enum";

describe("level service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  describe("findForChallenge", () => {
    it("returns the levels for the given challenge id", async () => {
      const prisma = getPrismaService();

      const { id } = await prisma.challenge.create({
        data: Factory.build<ChallengeData>(CHALLENGE, {}, { numberOfCodeLevels: 1, numberOfQuizLevels: 1 }),
      });

      const service = new LevelService(prisma);

      const levels = await service.findForChallenge(id);
      expect(levels).toBeTruthy();
      expect(levels.length).toEqual(2);
    });

    it("returns the levels in correct order", async () => {
      const prisma = getPrismaService();

      const { id } = await prisma.challenge.create({
        data: Factory.build<ChallengeData>(CHALLENGE),
      });

      await prisma.codeLevel.create({ data: Factory.build<CodeLevelData>(CODE_LEVEL, { challengeId: id, order: 3 }) });
      await prisma.codeLevel.create({ data: Factory.build<CodeLevelData>(CODE_LEVEL, { challengeId: id, order: 1 }) });
      await prisma.quizLevel.create({ data: Factory.build<QuizLevelData>(QUIZ_LEVEL, { challengeId: id, order: 2 }) });

      const service = new LevelService(prisma);
      const levels = await service.findForChallenge(id);

      expect(levels).toBeTruthy();
      expect(levels.length).toBe(3);
      expect(levels[0].order).toBeLessThan(levels[1].order);
      expect(levels[1].order).toBeLessThan(levels[2].order);
    });
  });

  describe("findOneForChallengeAtIndex", () => {
    it("returns the code level for the given challenge with the slug at the specified index", async () => {
      const secondLevelId = "8936524a-5291-4bee-a054-a2418a1d0ec3";
      const prisma = getPrismaService();

      const { id, slug } = await prisma.challenge.create({
        data: Factory.build<ChallengeData>(CHALLENGE),
      });

      await prisma.codeLevel.create({ data: Factory.build<CodeLevelData>(CODE_LEVEL, { id: secondLevelId, challengeId: id, order: 1 }) });
      await prisma.codeLevel.create({ data: Factory.build<CodeLevelData>(CODE_LEVEL, { challengeId: id, order: 0 }) });

      const service = new LevelService(prisma);

      const level = await service.findOneForChallengeAtIndex(slug, 1);

      expect(level).toHaveProperty("id", secondLevelId);
    });

    it("returns the quiz level for the given challenge with the slug at the specified index", async () => {
      const secondLevelId = "8936524a-5291-4bee-a054-a2418a1d0ec3";
      const prisma = getPrismaService();

      const { id, slug } = await prisma.challenge.create({
        data: Factory.build<ChallengeData>(CHALLENGE),
      });

      await prisma.quizLevel.create({ data: Factory.build<QuizLevelData>(QUIZ_LEVEL, { id: secondLevelId, challengeId: id, order: 1 }) });
      await prisma.codeLevel.create({ data: Factory.build<CodeLevelData>(CODE_LEVEL, { challengeId: id, order: 0 }) });

      const service = new LevelService(prisma);

      const level = await service.findOneForChallengeAtIndex(slug, 1);

      expect(level).toHaveProperty("id", secondLevelId);
    });

    it("returns null for an unknown level", async () => {
      const prisma = getPrismaService();
      const service = new LevelService(prisma);

      const level = await service.findOneForChallengeAtIndex("asdf", 1);

      expect(level).toBeNull();
    });
  });

  describe("getNumberOfLevelsForChallenge", () => {
    it("returns the number of levels assigned to the challenge", async () => {
      const prisma = getPrismaService();

      const { id } = await prisma.challenge.create({
        data: Factory.build<ChallengeData>(CHALLENGE, {}, { numberOfCodeLevels: 2, numberOfQuizLevels: 2 }),
      });

      const service = new LevelService(prisma);

      expect(await service.getNumberOfLevelsForChallenge(id)).toBe(4);
    });
  });

  describe("findStatusForCodeLevel", () => {
    const getUserAndLevel = async (): Promise<{ userId: string; levelId: string }> => {
      const prisma = getPrismaService();

      const { id: levelId } = await prisma.codeLevel.create({
        data: Factory.build<CodeLevelData>(CODE_LEVEL),
      });

      const { id: userId } = await prisma.user.create({
        data: Factory.build<UserData>(USER),
      });

      return {
        userId,
        levelId,
      };
    };

    it("returns OPEN if no attempts were made", async () => {
      const prisma = getPrismaService();

      const { userId, levelId } = await getUserAndLevel();

      const service = new LevelService(prisma);
      const status = await service.findStatusForCodeLevel(levelId, userId);

      expect(status).toBe(LevelStatus.OPEN);
    });

    it("returns IN_PROGRESS if only failed attempts were made", async () => {
      const prisma = getPrismaService();

      const { userId, levelId } = await getUserAndLevel();

      await prisma.codeLevelSubmission.create({
        data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
      });

      const service = new LevelService(prisma);
      const status = await service.findStatusForCodeLevel(levelId, userId);

      expect(status).toBe(LevelStatus.IN_PROGRESS);
    });

    it("returns FINISHED if at least one successful attempt was made", async () => {
      const prisma = getPrismaService();

      const { userId, levelId } = await getUserAndLevel();

      await prisma.codeLevelSubmission.create({
        data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
      });
      await prisma.codeLevelSubmission.create({
        data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
      });
      await prisma.codeLevelSubmission.create({
        data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, {
          levelId,
          userId,
          result: { create: { status: ResultStatus.SUCCESS } },
        }),
      });

      const service = new LevelService(prisma);
      const status = await service.findStatusForCodeLevel(levelId, userId);

      expect(status).toBe(LevelStatus.FINISHED);
    });
  });

  describe("findStatusForQuizLevel", () => {
    const getUserAndLevel = async (): Promise<{ userId: string; levelId: string }> => {
      const prisma = getPrismaService();

      const { id: levelId } = await prisma.quizLevel.create({
        data: Factory.build<QuizLevelData>(QUIZ_LEVEL),
      });

      const { id: userId } = await prisma.user.create({
        data: Factory.build<UserData>(USER),
      });

      return {
        userId,
        levelId,
      };
    };

    it("returns OPEN if no attempts were made", async () => {
      const prisma = getPrismaService();

      const { userId, levelId } = await getUserAndLevel();

      const service = new LevelService(prisma);
      const status = await service.findStatusForQuizLevel(levelId, userId);

      expect(status).toBe(LevelStatus.OPEN);
    });

    it("returns IN_PROGRESS if only failed attempts were made", async () => {
      const prisma = getPrismaService();

      const { userId, levelId } = await getUserAndLevel();

      await prisma.quizLevelSubmission.create({
        data: Factory.build<QuizLevelSubmissionData>(QUIZ_LEVEL_SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
      });

      const service = new LevelService(prisma);
      const status = await service.findStatusForQuizLevel(levelId, userId);

      expect(status).toBe(LevelStatus.IN_PROGRESS);
    });

    it("returns FINISHED if at least one successful attempt was made", async () => {
      const prisma = getPrismaService();

      const { userId, levelId } = await getUserAndLevel();

      await prisma.quizLevelSubmission.create({
        data: Factory.build<QuizLevelSubmissionData>(QUIZ_LEVEL_SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
      });
      await prisma.quizLevelSubmission.create({
        data: Factory.build<QuizLevelSubmissionData>(QUIZ_LEVEL_SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
      });
      await prisma.quizLevelSubmission.create({
        data: Factory.build<QuizLevelSubmissionData>(QUIZ_LEVEL_SUBMISSION, {
          levelId,
          userId,
          result: { create: { status: ResultStatus.SUCCESS } },
        }),
      });

      const service = new LevelService(prisma);
      const status = await service.findStatusForQuizLevel(levelId, userId);

      expect(status).toBe(LevelStatus.FINISHED);
    });
  });

  describe("isQuizOnly", () => {
    it("returns false if code levels are found", async () => {
      const prisma = getPrismaService();

      const { id } = await prisma.challenge.create({
        data: Factory.build<ChallengeData>(CHALLENGE, {}, { numberOfCodeLevels: 2, numberOfQuizLevels: 2 }),
      });

      const service = new LevelService(prisma);

      expect(await service.isQuizOnly(id)).toBe(false);
    });

    it("returns true if no code levels are found", async () => {
      const prisma = getPrismaService();

      const { id } = await prisma.challenge.create({
        data: Factory.build<ChallengeData>(CHALLENGE, {}, { numberOfCodeLevels: 0, numberOfQuizLevels: 2 }),
      });

      const service = new LevelService(prisma);

      expect(await service.isQuizOnly(id)).toBe(true);
    });

    it("does not throw an error if there are no levels", async () => {
      const prisma = getPrismaService();

      const { id } = await prisma.challenge.create({
        data: Factory.build<ChallengeData>(CHALLENGE, {}, { numberOfCodeLevels: 0, numberOfQuizLevels: 0 }),
      });

      const service = new LevelService(prisma);
      expect(service.isQuizOnly(id)).resolves.not.toThrowError();
      expect(await service.isQuizOnly(id)).toBe(true);
    });
  });
});
