import { useDatabase } from "@a11yphant/prisma";
import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { LevelService } from "./level.service";

describe("level service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  describe("findForChallenge", () => {
    it("returns the levels for the given challenge id", async () => {
      const prisma = getPrismaService();
      const { id } = await prisma.challenge.create({
        data: {
          name: "test",
          slug: "test",
          levels: {
            create: {
              instructions: "instructions",
              tldr: "tldr",
            },
          },
        },
      });
      const service = new LevelService(prisma);

      const levels = await service.findForChallenge(id);
      expect(levels).toBeTruthy();
      expect(levels.length).toEqual(1);
    });
  });

  describe("findOneForChallengeAtIndex", () => {
    it("returns the level for the given challenge with the slug at the specified index", async () => {
      const secondLevelId = "8936524a-5291-4bee-a054-a2418a1d0ec3";
      const prisma = getPrismaService();
      const challenge = await prisma.challenge.create({
        data: {
          name: "test",
          slug: "test",
          levels: {
            create: [
              {
                id: secondLevelId,
                order: 1,
                instructions: "instructions 2",
                tldr: "tldr",
              },
              {
                order: 0,
                instructions: "instructions 1",
                tldr: "tldr",
              },
            ],
          },
        },
      });
      const service = new LevelService(prisma);

      const level = await service.findOneForChallengeAtIndex(challenge.slug, 1);

      expect(level).toHaveProperty("id", secondLevelId);
    });

    it("returns null for an unkown level", async () => {
      const prisma = getPrismaService();
      const service = new LevelService(prisma);

      const level = await service.findOneForChallengeAtIndex("asdf", 1);

      expect(level).toBeNull();
    });
  });
});
