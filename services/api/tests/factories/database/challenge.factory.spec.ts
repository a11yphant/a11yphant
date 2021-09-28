import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { CHALLENGE } from "./constants";
import { Factory } from "./factory";
import { ChallengeData } from "./types";

describe("challenge database factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a challenge record with the default options", async () => {
    const prisma = getPrismaService();

    const challenge = await prisma.challenge.create({
      data: Factory.build<ChallengeData>(CHALLENGE),
    });

    expect(challenge).toBeTruthy();
  });

  it("can create a challenge record with with levels", async () => {
    const prisma = getPrismaService();

    const challenge = await prisma.challenge.create({
      data: Factory.build<ChallengeData>(CHALLENGE, {}, { numberOfLevels: 2 }),
      include: {
        codeLevels: true,
      },
    });

    expect(challenge.codeLevels).toHaveLength(2);
  });
});
