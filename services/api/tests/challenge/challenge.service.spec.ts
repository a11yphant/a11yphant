import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { ChallengeService } from "../../src/challenge/challenge.service";
import { ChallengeDifficulty } from "../../src/challenge/enums/challenge-difficulty.enum";
import { useDatabase } from "../helpers";

describe("challenge service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  describe("findOne", () => {
    it("can get a challenge for a given id", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);
      const { id } = await prisma.challenge.create({
        data: {
          name: "test",
          slug: "test-slug",
          difficulty: ChallengeDifficulty.EASY,
        },
      });

      const challenge = await service.findOne(id);
      expect(challenge).toBeTruthy();
      expect(challenge.name).toBe("test");
    });

    it("returns null if no entry was found in the database", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);

      const challenge = await service.findOne("uuid");
      expect(challenge).toBeFalsy();
    });
  });

  describe("findOneBySlug", () => {
    it("can get a challenge for a given slug", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);
      const { slug } = await prisma.challenge.create({
        data: {
          name: "test",
          slug: "test-slug",
          difficulty: ChallengeDifficulty.EASY,
        },
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

      const challenges = ["dani", "thomas", "luca", "michi"];

      await Promise.all(
        challenges.map((challengeSlug) =>
          prisma.challenge.create({
            data: {
              name: "hello",
              slug: challengeSlug,
              difficulty: ChallengeDifficulty.EASY,
            },
          }),
        ),
      );

      const queriedChallenges = await service.findAll();

      expect(queriedChallenges).toBeTruthy();
      expect(queriedChallenges.length).toBe(challenges.length);
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

        const challenges = [
          {
            name: "test1",
            slug: "test1",
            difficulty: ChallengeDifficulty.EASY,
          },
          {
            name: "test2",
            slug: "test2",
            difficulty: ChallengeDifficulty.MEDIUM,
          },
          {
            name: "test3",
            slug: "test3",
            difficulty: ChallengeDifficulty.HARD,
          },
        ];

        await Promise.all(challenges.map((data) => prisma.challenge.create({ data })));

        const foundChallenges = await service.findAll();

        expect(foundChallenges.length).toBe(challenges.length);
      });

      it("finds only filtered challenges", async () => {
        const prisma = getPrismaService();
        const service = new ChallengeService(prisma);

        const challenges = [
          {
            name: "test1",
            slug: "test1",
            difficulty: ChallengeDifficulty.EASY,
          },
          {
            name: "test2",
            slug: "test2",
            difficulty: ChallengeDifficulty.MEDIUM,
          },
          {
            name: "test3",
            slug: "test3",
            difficulty: ChallengeDifficulty.MEDIUM,
          },
          {
            name: "test4",
            slug: "test4",
            difficulty: ChallengeDifficulty.HARD,
          },
        ];

        await Promise.all(challenges.map((data) => prisma.challenge.create({ data })));

        const foundChallenges = await service.findAll({ difficulty: ChallengeDifficulty.MEDIUM });
        expect(foundChallenges.length).toBe(challenges.filter((c) => c.difficulty === ChallengeDifficulty.MEDIUM).length);
      });
    });
  });
});
