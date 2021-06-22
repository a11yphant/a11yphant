import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { ChallengeFactory } from "@tests/factories/database/challenge.factory";
import { LevelFactory } from "@tests/factories/database/level.factory";
import { RequirementFactory } from "@tests/factories/database/requirement.factory";
import { RuleFactory } from "@tests/factories/database/rule.factory";
import { useDatabase } from "@tests/helpers";
import faker from "faker";

import { RuleService } from "@/challenge/rule.service";

describe("rule service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("returns rule for a requirement", async () => {
    const prisma = getPrismaService();
    const rule = await prisma.rule.create({ data: RuleFactory.build() });
    const challenge = await prisma.challenge.create({ data: ChallengeFactory.build() });
    const level = await prisma.level.create({ data: LevelFactory.build({ challengeId: challenge.id }) });
    const requirement = await prisma.requirement.create({ data: RequirementFactory.build({ ruleId: rule.id, levelId: level.id }) });

    const ruleService = new RuleService(prisma);

    expect(await ruleService.findOneForRequirement(requirement.id)).toHaveProperty("id", rule.id);
  });

  it("returns null for a requirement if it is not found", async () => {
    const prisma = getPrismaService();
    await prisma.rule.create({ data: RuleFactory.build() });

    const ruleService = new RuleService(prisma);

    expect(await ruleService.findOneForRequirement(faker.datatype.uuid())).toBeNull();
  });
});
