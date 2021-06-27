import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { RuleFactory } from "./rule.factory";

describe("rule factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a rule record with default options", async () => {
    const prisma = getPrismaService();

    const rule = await prisma.rule.create({
      data: RuleFactory.build(),
    });

    expect(rule).toBeTruthy();
  });
});
