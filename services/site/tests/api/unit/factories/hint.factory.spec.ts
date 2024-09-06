/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { Factory, HINT, HintData } from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";

describe("hint database factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a hint record with the default options", async () => {
    const prisma = getPrismaService();

    const challenge = await prisma.hint.create({
      data: Factory.build<HintData>(HINT),
    });

    expect(challenge).toBeTruthy();
  });
});
