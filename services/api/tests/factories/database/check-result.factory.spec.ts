import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { CheckResultFactory } from "./check-result.factory";

describe("hint database factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a hint record with the default options", async () => {
    const prisma = getPrismaService();

    const result = await prisma.checkResult.create({
      data: CheckResultFactory.build(),
    });

    expect(result).toBeTruthy();
  });
});
