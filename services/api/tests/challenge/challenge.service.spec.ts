import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import {
  CHALLENGE,
  ChallengeData,
  CODE_LEVEL_SUBMISSION,
  CodeLevelSubmissionData,
  Factory,
  QUIZ_LEVEL_SUBMISSION,
  QuizLevelSubmissionData,
  USER,
  UserData,
} from "@tests/factories/database";
import { useDatabase } from "@tests/helpers";
import faker from "faker";

import { ChallengeService } from "@/challenge/challenge.service";
import { ChallengeDifficulty } from "@/challenge/enums/challenge-difficulty.enum";
import { ChallengeStatus } from "@/challenge/enums/challenge-status";
import { ResultStatus } from "@/submission/graphql/models/result-status.enum";

describe("challenge service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  const getUserAndChallenge = async ({
    numberOfCodeLevels = 0,
    numberOfQuizLevels = 0,
  }: {
    numberOfCodeLevels?: number;
    numberOfQuizLevels?: number;
  }): Promise<{ userId: string; challengeId: string }> => {
    const prisma = getPrismaService();

    const { id: userId } = await prisma.user.create({
      data: Factory.build<UserData>(USER),
    });

    const { id: challengeId } = await prisma.challenge.create({
      data: Factory.build<ChallengeData>(CHALLENGE, {}, { numberOfCodeLevels, numberOfQuizLevels }),
    });

    return { userId, challengeId };
  };

  describe("findOne", () => {
    it("can get a challenge for a given id", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);
      const { id } = await prisma.challenge.create({
        data: Factory.build<ChallengeData>(CHALLENGE),
      });

      const challenge = await service.findOne(id);
      expect(challenge).toBeTruthy();
      expect(challenge.id).toBe(id);
    });

    it("returns null if no entry was found in the database", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);

      const challenge = await service.findOne(faker.datatype.uuid());
      expect(challenge).toBeFalsy();
    });
  });

  describe("findOneBySlug", () => {
    it("can get a challenge for a given slug", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);
      const { slug, id } = await prisma.challenge.create({
        data: Factory.build<ChallengeData>(CHALLENGE),
      });

      const challenge = await service.findOneBySlug(slug);
      expect(challenge).toBeTruthy();
      expect(challenge.id).toBe(id);
    });

    it("returns null if no entry was found in the database", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);

      const challenge = await service.findOneBySlug("uuid");
      expect(challenge).toBeFalsy();
    });
  });

  describe("findAll", () => {
    it("finds all challenges", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);

      await prisma.challenge.createMany({
        data: Factory.buildList<ChallengeData>(CHALLENGE, 3),
      });

      const queriedChallenges = await service.findAll();

      expect(queriedChallenges).toBeTruthy();
      expect(queriedChallenges).toHaveLength(3);
    });

    it("returns an empty array when no challenges are found", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);

      const emptyChallenges = await service.findAll();
      expect(emptyChallenges.length).toBe(0);
    });

    describe("difficulty filter", () => {
      it("finds all challenges when no filter is set", async () => {
        const prisma = getPrismaService();
        const service = new ChallengeService(prisma);

        const challenges = Factory.buildList<ChallengeData>(CHALLENGE, 3);
        await prisma.challenge.createMany({ data: challenges });

        expect(await service.findAll()).toHaveLength(challenges.length);
      });

      it("finds only filtered challenges", async () => {
        const prisma = getPrismaService();
        const service = new ChallengeService(prisma);

        await prisma.challenge.createMany({ data: Factory.buildList<ChallengeData>(CHALLENGE, 2, { difficulty: ChallengeDifficulty.EASY }) });
        await prisma.challenge.createMany({ data: Factory.buildList<ChallengeData>(CHALLENGE, 2, { difficulty: ChallengeDifficulty.MEDIUM }) });

        const foundChallenges = await service.findAll({ difficulty: ChallengeDifficulty.MEDIUM });
        expect(foundChallenges).toHaveLength(2);
      });
    });
  });

  describe("getStatusForUserAndChallenge", () => {
    it("returns OPEN if no attempts were found", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);

      const { userId, challengeId } = await getUserAndChallenge({ numberOfCodeLevels: 3 });

      const status = await service.getStatusForUserAndChallenge(userId, challengeId);

      expect(status).toBe(ChallengeStatus.OPEN);
    });

    describe("returns IN_PROGRESS", () => {
      it("if code level attempts were found", async () => {
        const prisma = getPrismaService();
        const service = new ChallengeService(prisma);

        const { userId, challengeId } = await getUserAndChallenge({ numberOfCodeLevels: 3 });

        const { id: levelId } = await prisma.codeLevel.findFirst({
          where: { challengeId },
        });

        await prisma.codeLevelSubmission.create({
          data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
        });

        const status = await service.getStatusForUserAndChallenge(userId, challengeId);

        expect(status).toBe(ChallengeStatus.IN_PROGRESS);
      });

      it("if quiz level attempts were found", async () => {
        const prisma = getPrismaService();
        const service = new ChallengeService(prisma);

        const { userId, challengeId } = await getUserAndChallenge({ numberOfQuizLevels: 3 });

        const { id: levelId } = await prisma.quizLevel.findFirst({
          where: { challengeId },
        });

        await prisma.quizLevelSubmission.create({
          data: Factory.build<QuizLevelSubmissionData>(QUIZ_LEVEL_SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
        });

        const status = await service.getStatusForUserAndChallenge(userId, challengeId);

        expect(status).toBe(ChallengeStatus.IN_PROGRESS);
      });

      it("if some, but not all levels are finished", async () => {
        const prisma = getPrismaService();
        const service = new ChallengeService(prisma);

        const { userId, challengeId } = await getUserAndChallenge({ numberOfCodeLevels: 3, numberOfQuizLevels: 1 });

        const levels = await prisma.codeLevel.findMany({
          where: { challengeId },
        });

        await Promise.all([
          prisma.codeLevelSubmission.create({
            data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, {
              levelId: levels[0].id,
              userId,
              result: { create: { status: ResultStatus.SUCCESS } },
            }),
          }),
          prisma.codeLevelSubmission.create({
            data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, {
              levelId: levels[1].id,
              userId,
              result: { create: { status: ResultStatus.FAIL } },
            }),
          }),
        ]);

        const status = await service.getStatusForUserAndChallenge(userId, challengeId);

        expect(status).toBe(ChallengeStatus.IN_PROGRESS);
      });
    });

    describe("returns FINISHED", () => {
      it("if all code levels were finished once", async () => {
        const prisma = getPrismaService();
        const service = new ChallengeService(prisma);

        const { userId, challengeId } = await getUserAndChallenge({ numberOfCodeLevels: 3 });

        const levels = await prisma.codeLevel.findMany({
          where: { challengeId },
        });

        await prisma.codeLevelSubmission.create({
          data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, {
            levelId: levels[0].id,
            userId,
            result: { create: { status: ResultStatus.FAIL } },
          }),
        });

        await Promise.all(
          levels.map((level) =>
            prisma.codeLevelSubmission.create({
              data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, {
                levelId: level.id,
                userId,
                result: { create: { status: ResultStatus.SUCCESS } },
              }),
            }),
          ),
        );

        const status = await service.getStatusForUserAndChallenge(userId, challengeId);

        expect(status).toBe(ChallengeStatus.FINISHED);
      });

      it("if all quiz levels were finished", async () => {
        const prisma = getPrismaService();
        const service = new ChallengeService(prisma);

        const { userId, challengeId } = await getUserAndChallenge({ numberOfQuizLevels: 3 });

        const levels = await prisma.quizLevel.findMany({
          where: { challengeId },
        });

        await Promise.all(
          levels.map((level) =>
            prisma.quizLevelSubmission.create({
              data: Factory.build<QuizLevelSubmissionData>(QUIZ_LEVEL_SUBMISSION, {
                levelId: level.id,
                userId,
                result: { create: { status: ResultStatus.SUCCESS } },
              }),
            }),
          ),
        );

        const status = await service.getStatusForUserAndChallenge(userId, challengeId);

        expect(status).toBe(ChallengeStatus.FINISHED);
      });

      it("when some levels were finished more than once", async () => {
        const prisma = getPrismaService();
        const service = new ChallengeService(prisma);

        const { userId, challengeId } = await getUserAndChallenge({ numberOfCodeLevels: 3, numberOfQuizLevels: 1 });

        const codeLevels = await prisma.codeLevel.findMany({
          where: { challengeId },
        });

        await prisma.codeLevelSubmission.create({
          data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, {
            levelId: codeLevels[0].id,
            userId,
            result: { create: { status: ResultStatus.FAIL } },
          }),
        });

        await Promise.all(
          codeLevels.map((level) =>
            prisma.codeLevelSubmission.create({
              data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, {
                levelId: level.id,
                userId,
                result: { create: { status: ResultStatus.SUCCESS } },
              }),
            }),
          ),
        );

        await prisma.codeLevelSubmission.create({
          data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, {
            levelId: codeLevels[2].id,
            userId,
            result: { create: { status: ResultStatus.SUCCESS } },
          }),
        });

        const quizLevel = await prisma.quizLevel.findFirst({
          where: { challengeId },
        });

        await Promise.all(
          [1, 2].map(() =>
            prisma.quizLevelSubmission.create({
              data: Factory.build<QuizLevelSubmissionData>(QUIZ_LEVEL_SUBMISSION, {
                levelId: quizLevel.id,
                userId,
                result: { create: { status: ResultStatus.SUCCESS } },
              }),
            }),
          ),
        );

        const status = await service.getStatusForUserAndChallenge(userId, challengeId);

        expect(status).toBe(ChallengeStatus.FINISHED);
      });
    });
  });

  describe("getNumberOfFinishedLevelsForUserAndChallenge", () => {
    it("returns the number of finished levels", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);

      const { userId, challengeId } = await getUserAndChallenge({ numberOfCodeLevels: 3, numberOfQuizLevels: 3 });

      const codeLevels = await prisma.codeLevel.findMany({
        where: { challengeId },
      });

      await Promise.all(
        codeLevels.map((level) =>
          prisma.codeLevelSubmission.create({
            data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, {
              levelId: level.id,
              userId,
              result: { create: { status: ResultStatus.SUCCESS } },
            }),
          }),
        ),
      );

      const quizLevels = await prisma.quizLevel.findMany({
        where: { challengeId },
      });

      await Promise.all(
        quizLevels.map((level) =>
          prisma.quizLevelSubmission.create({
            data: Factory.build<QuizLevelSubmissionData>(QUIZ_LEVEL_SUBMISSION, {
              levelId: level.id,
              userId,
              result: { create: { status: ResultStatus.SUCCESS } },
            }),
          }),
        ),
      );

      const status = await service.getNumberOfFinishedLevelsForUserAndChallenge(userId, challengeId);

      expect(status).toEqual(6);
    });
  });
});
