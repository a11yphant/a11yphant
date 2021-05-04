import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { RuleService } from "../../src/challenge/rule.service";
import { ChallengeFactory } from "../factories/database/challenge.factory";
import { LevelFactory } from "../factories/database/level.factory";
import { RequirementFactory } from "../factories/database/requirement.factory";
import { RuleFactory } from "../factories/database/rule.factory";
import { useDatabase } from "../helpers";

describe("rule service", () => {
  it("returns rule for a requirement", async () => {
    const { getPrismaService } = useDatabase(createMock<Logger>());
    const prisma = getPrismaService();
    const rule = await prisma.rule.create({ data: RuleFactory.build() });
    const challenge = await prisma.challenge.create({ data: ChallengeFactory.build() });
    const level = await prisma.level.create({ data: LevelFactory.build({ challengeId: challenge.id }) });
    const requirement = await prisma.requirement.create({ data: RequirementFactory.build({ ruleId: rule.id, levelId: level.id }) });

    const ruleService = new RuleService(prisma);

    expect(await ruleService.findOneForRequirement(requirement.id)).toHaveProperty("id", rule.id);
  });

  it("returns null for a requirement if it is not found", async () => {
    const { getPrismaService } = useDatabase(createMock<Logger>());
    const prisma = getPrismaService();
    await prisma.rule.create({ data: RuleFactory.build() });

    const ruleService = new RuleService(prisma);

    expect(await ruleService.findOneForRequirement("not-existing-uuid")).toBeNull();
  });
});
