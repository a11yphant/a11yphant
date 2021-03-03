import { useDatabase } from "@a11y-challenges/prisma";
import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { ChallengeService } from "./challenge.service";

describe("challenge service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  describe("findOne", () => {
    it("can get a challenge for a given id", async () => {
      const prisma = getPrismaService();
      const service = new ChallengeService(prisma);
      const { id } = await prisma.challenge.create({
        data: {
          name: "test",
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
});
