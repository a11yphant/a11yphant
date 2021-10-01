import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { RESULT } from "./constants";
import { Factory } from "./factory";
import { ResultData } from "./types";

describe("result factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a result record with default options", async () => {
    const prisma = getPrismaService();

    const result = await prisma.result.create({
      data: Factory.build<ResultData>(RESULT),
    });

    expect(result).toBeTruthy();
  });
});
