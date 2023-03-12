import { faker } from "@faker-js/faker";
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
} from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";

import { ChallengeService } from "@/challenge/challenge.service";
import { ChallengeDifficulty } from "@/challenge/enums/challenge-difficulty.enum";
import { ChallengeStatus } from "@/challenge/enums/challenge-status";
import { PrismaService } from "@/prisma/prisma.service";
import { ResultStatus } from "@/submission/graphql/models/result-status.enum";

describe("challenge service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  const createChallenge = async ({
    numberOfCodeLevels = 0,
    numberOfQuizLevels = 0,
  }: {
    numberOfCodeLevels?: number;
    numberOfQuizLevels?: number;
  }): Promise<string> => {
    const prisma = getPrismaService();
    const { id: challengeId } = await prisma.challenge.create({
      data: Factory.build<ChallengeData>(CHALLENGE, {}, { numberOfCodeLevels, numberOfQuizLevels }),
    });

    return challengeId;
  };

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

    const challengeId = await createChallenge({ numberOfCodeLevels, numberOfQuizLevels });

    return { userId, challengeId };
  };

  const getUser = async (): Promise<string> => {
    const prisma = getPrismaService();

    const { id: userId } = await prisma.user.create({
      data: Factory.build<UserData>(USER),
    });

    return userId;
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

      const userId = await getUser();

      const queriedChallenges = await service.findAll(userId);

      expect(queriedChallenges).toBeTruthy();
      expect(queriedChallenges).toHaveLength(3);
    });

    it("returns an empty array when no challenges are found", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);

      const userId = await getUser();

      const emptyChallenges = await service.findAll(userId);
      expect(emptyChallenges.length).toBe(0);
    });

    describe("difficulty filter", () => {
      it("finds all challenges when no filter is set", async () => {
        const prisma = getPrismaService();
        const service = new ChallengeService(prisma);

        const challenges = Factory.buildList<ChallengeData>(CHALLENGE, 3);
        await prisma.challenge.createMany({ data: challenges });

        const userId = await getUser();

        expect(await service.findAll(userId)).toHaveLength(challenges.length);
      });

      it("finds only filtered challenges", async () => {
        const prisma = getPrismaService();
        const service = new ChallengeService(prisma);

        await prisma.challenge.createMany({ data: Factory.buildList<ChallengeData>(CHALLENGE, 2, { difficulty: ChallengeDifficulty.EASY }) });
        await prisma.challenge.createMany({ data: Factory.buildList<ChallengeData>(CHALLENGE, 2, { difficulty: ChallengeDifficulty.MEDIUM }) });

        const userId = await getUser();

        const foundChallenges = await service.findAll(userId, { difficulty: ChallengeDifficulty.MEDIUM });
        expect(foundChallenges).toHaveLength(2);
      });
    });

    describe("currentUserStatus filter", () => {
      it("can find challenges with the status IN_PROGRESS for a user", async () => {
        const prisma = getPrismaService();
        const service = new ChallengeService(prisma);

        await prisma.challenge.createMany({ data: Factory.buildList<ChallengeData>(CHALLENGE, 2, { difficulty: ChallengeDifficulty.EASY }) });

        const { userId, challengeId } = await getUserAndChallenge({ numberOfCodeLevels: 3 });

        const { id: levelId } = await prisma.codeLevel.findFirst({
          where: { challengeId },
        });

        await prisma.codeLevelSubmission.create({
          data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
        });

        const foundChallenges = await service.findAll(userId, { currentUserStatus: ChallengeStatus.IN_PROGRESS });
        expect(foundChallenges).toHaveLength(1);
      });
    });

    describe("difficulty and currentUserStatus filter", () => {
      it("can find challenges filtered by the difficulty HARD and status OPEN", async () => {
        const prisma = getPrismaService();
        const service = new ChallengeService(prisma);

        await prisma.challenge.createMany({ data: Factory.buildList<ChallengeData>(CHALLENGE, 2, { difficulty: ChallengeDifficulty.EASY }) });
        await prisma.challenge.createMany({ data: Factory.buildList<ChallengeData>(CHALLENGE, 2, { difficulty: ChallengeDifficulty.HARD }) });

        const { id: challengeId } = await prisma.challenge.create({
          data: Factory.build<ChallengeData>(CHALLENGE, { difficulty: ChallengeDifficulty.HARD }, { numberOfCodeLevels: 2, numberOfQuizLevels: 2 }),
        });

        const { id: levelId } = await prisma.codeLevel.findFirst({
          where: { challengeId },
        });

        const userId = await getUser();

        await prisma.codeLevelSubmission.create({
          data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
        });

        const foundChallenges = await service.findAll(userId, {
          difficulty: ChallengeDifficulty.HARD,
          currentUserStatus: ChallengeStatus.OPEN,
        });
        expect(foundChallenges).toHaveLength(2);
      });
    });
  });

  describe("getNumberOfCodeLevelSubmissionsForUser", () => {
    it("returns the number of code level submissions for a user", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);

      const { userId, challengeId } = await getUserAndChallenge({ numberOfCodeLevels: 3 });

      const { id: levelId } = await prisma.codeLevel.findFirst({
        where: { challengeId },
      });

      await prisma.codeLevelSubmission.create({
        data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
      });

      const numberOfSubmissions = await service.getNumberOfCodeLevelSubmissionsForUser(challengeId, userId);
      expect(numberOfSubmissions).toBe(1);
    });
  });

  describe("getNumberOfQuizLevelSubmissionsForUser", () => {
    it("returns the number of quiz level submissions for a user", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);

      const { userId, challengeId } = await getUserAndChallenge({ numberOfQuizLevels: 3 });

      const { id: levelId } = await prisma.quizLevel.findFirst({
        where: { challengeId },
      });

      await prisma.quizLevelSubmission.create({
        data: Factory.build<QuizLevelSubmissionData>(QUIZ_LEVEL_SUBMISSION, { levelId, userId, result: { create: { status: ResultStatus.FAIL } } }),
      });

      const numberOfSubmissions = await service.getNumberOfQuizLevelSubmissionsForUser(challengeId, userId);
      expect(numberOfSubmissions).toBe(1);
    });
  });

  describe("getNumberOfQuizLevelsForChallenge", () => {
    it("returns the number of quiz levels for a challenge", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);

      const challengeId = await createChallenge({ numberOfQuizLevels: 3 });

      const numberOfQuizLevels = await service.getNumberOfQuizLevelsForChallenge(challengeId);
      expect(numberOfQuizLevels).toBe(3);
    });
  });

  describe("getNumberOfCodeLevelsForChallenge", () => {
    it("returns the number of code levels for a challenge", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);

      const challengeId = await createChallenge({ numberOfCodeLevels: 3 });

      const numberOfCodeLevels = await service.getNumberOfCodeLevelsForChallenge(challengeId);
      expect(numberOfCodeLevels).toBe(3);
    });
  });

  describe("getNumberOfFinishedCodeLevelsForUser", () => {
    it("returns the number of finished code levels for a user", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);

      const { userId, challengeId } = await getUserAndChallenge({ numberOfCodeLevels: 3 });

      const { id: levelId } = await prisma.codeLevel.findFirst({
        where: { challengeId },
      });

      await prisma.codeLevelSubmission.create({
        data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, {
          levelId,
          userId,
          result: { create: { status: ResultStatus.SUCCESS } },
        }),
      });

      const numberOfFinishedCodeLevels = await service.getNumberOfFinishedCodeLevelsForUser(challengeId, userId);
      expect(numberOfFinishedCodeLevels).toBe(1);
    });
  });

  describe("getNumberOfFinishedQuizLevelsForUser", () => {
    it("returns the number of finished quiz levels for a user", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);

      const { userId, challengeId } = await getUserAndChallenge({ numberOfQuizLevels: 3 });

      const { id: levelId } = await prisma.quizLevel.findFirst({
        where: { challengeId },
      });

      await prisma.quizLevelSubmission.create({
        data: Factory.build<QuizLevelSubmissionData>(QUIZ_LEVEL_SUBMISSION, {
          levelId,
          userId,
          result: { create: { status: ResultStatus.SUCCESS } },
        }),
      });

      const numberOfFinishedQuizLevels = await service.getNumberOfFinishedQuizLevelsForUser(challengeId, userId);
      expect(numberOfFinishedQuizLevels).toBe(1);
    });
  });

  describe("getStatusForUserAndChallenge", () => {
    it("returns OPEN if no attempts were found", async () => {
      const service = new ChallengeService(createMock<PrismaService>());
      jest.spyOn(service, "getNumberOfCodeLevelSubmissionsForUser").mockResolvedValue(0);
      jest.spyOn(service, "getNumberOfQuizLevelSubmissionsForUser").mockResolvedValue(0);

      const status = await service.getStatusForUserAndChallenge("userId", "challengeId");

      expect(status).toBe(ChallengeStatus.OPEN);
    });

    describe("returns IN_PROGRESS", () => {
      it("if code level attempts were found", async () => {
        const service = new ChallengeService(createMock<PrismaService>());
        jest.spyOn(service, "getNumberOfCodeLevelSubmissionsForUser").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfQuizLevelSubmissionsForUser").mockResolvedValue(0);
        jest.spyOn(service, "getNumberOfQuizLevelsForChallenge").mockResolvedValue(0);
        jest.spyOn(service, "getNumberOfCodeLevelsForChallenge").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfFinishedCodeLevelsForUser").mockResolvedValue(0);
        jest.spyOn(service, "getNumberOfFinishedQuizLevelsForUser").mockResolvedValue(0);

        const status = await service.getStatusForUserAndChallenge("userId", "challengeId");

        expect(status).toBe(ChallengeStatus.IN_PROGRESS);
      });

      it("if quiz level attempts were found", async () => {
        const service = new ChallengeService(createMock<PrismaService>());
        jest.spyOn(service, "getNumberOfCodeLevelSubmissionsForUser").mockResolvedValue(0);
        jest.spyOn(service, "getNumberOfQuizLevelSubmissionsForUser").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfCodeLevelsForChallenge").mockResolvedValue(0);
        jest.spyOn(service, "getNumberOfQuizLevelsForChallenge").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfFinishedCodeLevelsForUser").mockResolvedValue(0);
        jest.spyOn(service, "getNumberOfFinishedQuizLevelsForUser").mockResolvedValue(0);

        const status = await service.getStatusForUserAndChallenge("userId", "challengeId");

        expect(status).toBe(ChallengeStatus.IN_PROGRESS);
      });

      it("if some, but not all levels are finished", async () => {
        const service = new ChallengeService(createMock<PrismaService>());
        jest.spyOn(service, "getNumberOfCodeLevelSubmissionsForUser").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfQuizLevelSubmissionsForUser").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfCodeLevelsForChallenge").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfQuizLevelsForChallenge").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfFinishedCodeLevelsForUser").mockResolvedValue(2);
        jest.spyOn(service, "getNumberOfFinishedQuizLevelsForUser").mockResolvedValue(2);

        const status = await service.getStatusForUserAndChallenge("userId", "challengeId");

        expect(status).toBe(ChallengeStatus.IN_PROGRESS);
      });
    });

    describe("returns FINISHED", () => {
      it("if all code levels were finished once", async () => {
        const service = new ChallengeService(createMock<PrismaService>());
        jest.spyOn(service, "getNumberOfCodeLevelSubmissionsForUser").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfQuizLevelSubmissionsForUser").mockResolvedValue(0);
        jest.spyOn(service, "getNumberOfCodeLevelsForChallenge").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfQuizLevelsForChallenge").mockResolvedValue(0);
        jest.spyOn(service, "getNumberOfFinishedCodeLevelsForUser").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfFinishedQuizLevelsForUser").mockResolvedValue(0);

        const status = await service.getStatusForUserAndChallenge("userId", "challengeId");

        expect(status).toBe(ChallengeStatus.FINISHED);
      });

      it("if all quiz levels were finished", async () => {
        const service = new ChallengeService(createMock<PrismaService>());
        jest.spyOn(service, "getNumberOfCodeLevelSubmissionsForUser").mockResolvedValue(0);
        jest.spyOn(service, "getNumberOfQuizLevelSubmissionsForUser").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfCodeLevelsForChallenge").mockResolvedValue(0);
        jest.spyOn(service, "getNumberOfQuizLevelsForChallenge").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfFinishedCodeLevelsForUser").mockResolvedValue(0);
        jest.spyOn(service, "getNumberOfFinishedQuizLevelsForUser").mockResolvedValue(3);

        const status = await service.getStatusForUserAndChallenge("userId", "challengeId");

        expect(status).toBe(ChallengeStatus.FINISHED);
      });

      it("when some levels were finished more than once", async () => {
        const service = new ChallengeService(createMock<PrismaService>());
        jest.spyOn(service, "getNumberOfCodeLevelSubmissionsForUser").mockResolvedValue(4);
        jest.spyOn(service, "getNumberOfQuizLevelSubmissionsForUser").mockResolvedValue(4);
        jest.spyOn(service, "getNumberOfCodeLevelsForChallenge").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfQuizLevelsForChallenge").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfFinishedCodeLevelsForUser").mockResolvedValue(3);
        jest.spyOn(service, "getNumberOfFinishedQuizLevelsForUser").mockResolvedValue(3);

        const status = await service.getStatusForUserAndChallenge("userId", "challengeId");

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
