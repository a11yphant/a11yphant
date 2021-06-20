import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { LevelService } from "../../src/challenge/level.service";
import { ChallengeFactory } from "../factories/database/challenge.factory";
import { LevelFactory } from "../factories/database/level.factory";
import { useDatabase } from "../helpers";

describe("level service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  describe("findForChallenge", () => {
    it("returns the levels for the given challenge id", async () => {
      const prisma = getPrismaService();

      const { id } = await prisma.challenge.create({
        data: ChallengeFactory.build({}, { numberOfLevels: 1 }),
      });

      const service = new LevelService(prisma);

      const levels = await service.findForChallenge(id);
      expect(levels).toBeTruthy();
      expect(levels.length).toEqual(1);
    });

    it("returns the levels in correct order", async () => {
      const prisma = getPrismaService();

      const { id } = await prisma.challenge.create({
        data: ChallengeFactory.build(),
      });

      await prisma.level.create({ data: LevelFactory.build({ challengeId: id, order: 3 }) });
      await prisma.level.create({ data: LevelFactory.build({ challengeId: id, order: 1 }) });
      await prisma.level.create({ data: LevelFactory.build({ challengeId: id, order: 2 }) });

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
        data: ChallengeFactory.build(),
      });

      await prisma.level.create({ data: LevelFactory.build({ id: secondLevelId, challengeId: id, order: 1 }) });
      await prisma.level.create({ data: LevelFactory.build({ challengeId: id, order: 0 }) });

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
        data: ChallengeFactory.build({}, { numberOfLevels: 2 }),
      });

      const service = new LevelService(prisma);
      const count = await service.getNumberOfLevelsForChallenge(id);
      expect(count).toBe(2);
    });
  });
});
