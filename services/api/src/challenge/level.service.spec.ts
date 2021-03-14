import { useDatabase } from "@a11y-challenges/prisma";
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
});
