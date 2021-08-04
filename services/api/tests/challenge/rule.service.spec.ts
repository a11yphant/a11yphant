import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { RequirementFactory } from "@tests/factories/database/requirement.factory";
import { RuleFactory } from "@tests/factories/database/rule.factory";
import { useDatabase } from "@tests/helpers";
import faker from "faker";

import { RuleService } from "@/challenge/rule.service";

describe("rule service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("returns rule for a requirement", async () => {
    const prisma = getPrismaService();
    const requirement = await prisma.requirement.create({ data: RequirementFactory.build() });

    const ruleService = new RuleService(prisma);

    expect(await ruleService.findOneForRequirement(requirement.id)).toHaveProperty("id", requirement.ruleId);
  });

  it("returns null for a requirement if it is not found", async () => {
    const prisma = getPrismaService();
    await prisma.rule.create({ data: RuleFactory.build() });

    const ruleService = new RuleService(prisma);

    expect(await ruleService.findOneForRequirement(faker.datatype.uuid())).toBeNull();
  });
});
