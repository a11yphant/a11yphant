/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { CODE_LEVEL_RESULT, CodeLevelResultData, Factory } from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";

describe("code level result factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a result record with default options", async () => {
    const prisma = getPrismaService();

    const result = await prisma.codeLevelResult.create({
      data: Factory.build<CodeLevelResultData>(CODE_LEVEL_RESULT),
    });

    expect(result).toBeTruthy();
  });
});
