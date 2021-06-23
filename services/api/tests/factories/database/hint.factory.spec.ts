import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { HintFactory } from "./hint.factory";

describe("hint database factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a hint record with the default options", async () => {
    const prisma = getPrismaService();

    const challenge = await prisma.hint.create({
      data: HintFactory.build(),
    });

    expect(challenge).toBeTruthy();
  });
});
