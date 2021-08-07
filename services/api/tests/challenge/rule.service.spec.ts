import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { Factory, REQUIREMENT, RequirementData, RULE, RuleData } from "@tests/factories/database";
import { useDatabase } from "@tests/helpers";
import faker from "faker";

import { RuleService } from "@/challenge/rule.service";

describe("rule service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("returns rule for a requirement", async () => {
    const prisma = getPrismaService();
    const requirement = await prisma.requirement.create({ data: Factory.build<RequirementData>(REQUIREMENT) });

    const ruleService = new RuleService(prisma);

    expect(await ruleService.findOneForRequirement(requirement.id)).toHaveProperty("id", requirement.ruleId);
  });

  it("returns null for a requirement if it is not found", async () => {
    const prisma = getPrismaService();
    await prisma.rule.create({ data: Factory.build<RuleData>(RULE) });

    const ruleService = new RuleService(prisma);

    expect(await ruleService.findOneForRequirement(faker.datatype.uuid())).toBeNull();
  });
});
