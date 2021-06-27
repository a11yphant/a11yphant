import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { ResultFactory } from "./result.factory";

describe("result factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a result record with default options", async () => {
    const prisma = getPrismaService();

    const result = await prisma.result.create({
      data: ResultFactory.build(),
    });

    expect(result).toBeTruthy();
  });
});
