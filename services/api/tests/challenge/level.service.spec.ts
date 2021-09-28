import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { CHALLENGE, ChallengeData, Factory, LEVEL, LevelData, SUBMISSION, SubmissionData, USER, UserData } from "@tests/factories/database";
import { useDatabase } from "@tests/helpers";

import { LevelStatus } from "@/challenge/enums/level-status.enum";
import { LevelService } from "@/challenge/level.service";
import { ResultStatus } from "@/submission/graphql/models/result-status.enum";

describe("level service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  describe("findForChallenge", () => {
    it("returns the levels for the given challenge id", async () => {
      const prisma = getPrismaService();

      const { id } = await prisma.challenge.create({
        data: Factory.build<ChallengeData>(CHALLENGE, {}, { numberOfLevels: 1 }),
      });

      const service = new LevelService(prisma);

      const levels = await service.findForChallenge(id);
      expect(levels).toBeTruthy();
      expect(levels.length).toEqual(1);
    });

    it("returns the levels in correct order", async () => {
      const prisma = getPrismaService();

      const { id } = await prisma.challenge.create({
        data: Factory.build<ChallengeData>(CHALLENGE),
      });

      await prisma.codeLevel.create({ data: Factory.build<LevelData>(LEVEL, { challengeId: id, order: 3 }) });
      await prisma.codeLevel.create({ data: Factory.build<LevelData>(LEVEL, { challengeId: id, order: 1 }) });
      await prisma.codeLevel.create({ data: Factory.build<LevelData>(LEVEL, { challengeId: id, order: 2 }) });

      const service = new LevelService(prisma);
      const levels = await service.findForChallenge(id);

      expect(levels).toBeTruthy();
      expect(levels.length).toBe(3);
      expect(levels[0].order).toBeLessThan(levels[1].order);
      expect(levels[1].order).toBeLessThan(levels[2].order);
    });
  });

  describe("findOneForChallengeAtIndex", () => {
    it("returns the level for the given challenge with the slug at the specified index", async () => {
      const secondLevelId = "8936524a-5291-4bee-a054-a2418a1d0ec3";
      const prisma = getPrismaService();

      const { id, slug } = await prisma.challenge.create({
        data: Factory.build<ChallengeData>(CHALLENGE),
      });

      await prisma.codeLevel.create({ data: Factory.build<LevelData>(LEVEL, { id: secondLevelId, challengeId: id, order: 1 }) });
      await prisma.codeLevel.create({ data: Factory.build<LevelData>(LEVEL, { challengeId: id, order: 0 }) });

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
        data: Factory.build<ChallengeData>(CHALLENGE, {}, { numberOfLevels: 2 }),
      });

      const service = new LevelService(prisma);
      const count = await service.getNumberOfLevelsForChallenge(id);
      expect(count).toBe(2);
    });
  });

  describe("findStatusForUserAndLevel", () => {
    const getUserAndLevel = async (): Promise<{ userId: string; levelId: string }> => {
      const prisma = getPrismaService();

      const { id: levelId } = await prisma.codeLevel.create({
        data: Factory.build<LevelData>(LEVEL),
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
      const status = await service.findStatusForUserAndLevel(userId, levelId);

      expect(status).toBe(LevelStatus.OPEN);
    });

    it("returns IN_PROGRESS if only failed attempts were made", async () => {
      const prisma = getPrismaService();

      const { userId, levelId } = await getUserAndLevel();

      await prisma.submission.create({
        data: Factory.build<SubmissionData>(SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
      });

      const service = new LevelService(prisma);
      const status = await service.findStatusForUserAndLevel(userId, levelId);

      expect(status).toBe(LevelStatus.IN_PROGRESS);
    });

    it("returns FINISHED if at least one successful attempt was made", async () => {
      const prisma = getPrismaService();

      const { userId, levelId } = await getUserAndLevel();

      await prisma.submission.create({
        data: Factory.build<SubmissionData>(SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
      });
      await prisma.submission.create({
        data: Factory.build<SubmissionData>(SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
      });
      await prisma.submission.create({
        data: Factory.build<SubmissionData>(SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.SUCCESS } } }),
      });

      const service = new LevelService(prisma);
      const status = await service.findStatusForUserAndLevel(userId, levelId);

      expect(status).toBe(LevelStatus.FINISHED);
    });
  });
});
