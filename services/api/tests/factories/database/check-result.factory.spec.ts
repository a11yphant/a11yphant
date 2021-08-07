import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { CHECK_RESULT } from "./constants";
import { Factory } from "./factory";
import { CheckResultData } from "./types";

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
