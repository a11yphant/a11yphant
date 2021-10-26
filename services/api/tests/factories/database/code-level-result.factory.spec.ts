import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { CODE_LEVEL_RESULT } from "./constants";
import { Factory } from "./factory";
import { CodeLevelResultData } from "./types";

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
