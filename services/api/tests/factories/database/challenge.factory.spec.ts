import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { ChallengeFactory } from "./challenge.factory";

describe("challenge database factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a challenge record with the default options", async () => {
    const prisma = getPrismaService();

    const challenge = await prisma.challenge.create({
      data: ChallengeFactory.build(),
    });

    expect(challenge).toBeTruthy();
  });

  it("can create a challenge record with with levels", async () => {
    const prisma = getPrismaService();

    const challenge = await prisma.challenge.create({
      data: ChallengeFactory.build({}, { numberOfLevels: 2 }),
      include: {
        levels: true,
      },
    });

    expect(challenge.levels).toHaveLength(2);
  });
});
