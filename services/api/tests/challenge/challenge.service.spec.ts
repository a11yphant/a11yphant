import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { ChallengeFactory } from "@tests/factories/database/challenge.factory";
import { useDatabase } from "@tests/helpers";
import faker from "faker";

import { ChallengeService } from "@/challenge/challenge.service";
import { ChallengeDifficulty } from "@/challenge/enums/challenge-difficulty.enum";

describe("challenge service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  describe("findOne", () => {
    it("can get a challenge for a given id", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);
      const { id } = await prisma.challenge.create({
        data: ChallengeFactory.build(),
      });

      const challenge = await service.findOne(id);
      expect(challenge).toBeTruthy();
      expect(challenge.name).toBe("test");
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
      const { slug } = await prisma.challenge.create({
        data: ChallengeFactory.build(),
      });

      const challenge = await service.findOneBySlug(slug);
      expect(challenge).toBeTruthy();
      expect(challenge.name).toBe("test");
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
        data: ChallengeFactory.buildList(3),
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

        const challenges = ChallengeFactory.buildList(3);
        await prisma.challenge.createMany({ data: challenges });

        expect(await service.findAll()).toHaveLength(challenges.length);
      });

      it("finds only filtered challenges", async () => {
        const prisma = getPrismaService();
        const service = new ChallengeService(prisma);

        await prisma.challenge.createMany({ data: ChallengeFactory.buildList(2, { difficulty: ChallengeDifficulty.EASY }) });
        await prisma.challenge.createMany({ data: ChallengeFactory.buildList(2, { difficulty: ChallengeDifficulty.MEDIUM }) });

        const foundChallenges = await service.findAll({ difficulty: ChallengeDifficulty.MEDIUM });
        expect(foundChallenges).toHaveLength(2);
      });
    });
  });
});
