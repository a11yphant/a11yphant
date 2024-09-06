/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { CHECK_RESULT, CheckResultData, Factory } from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";

describe("hint database factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a hint record with the default options", async () => {
    const prisma = getPrismaService();

    const result = await prisma.checkResult.create({
      data: Factory.build<CheckResultData>(CHECK_RESULT),
    });

    expect(result).toBeTruthy();
  });
});
