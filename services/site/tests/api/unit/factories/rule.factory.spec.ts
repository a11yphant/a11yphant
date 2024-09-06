/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { Factory, RULE, RuleData } from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";

describe("rule factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a rule record with default options", async () => {
    const prisma = getPrismaService();

    const rule = await prisma.rule.create({
      data: Factory.build<RuleData>(RULE),
    });

    expect(rule).toBeTruthy();
  });
});
