import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

import { LevelFactory } from "./level.factory";
import { RuleFactory } from "./rule.factory";

export const RequirementFactory = Factory.define<Prisma.RequirementCreateArgs["data"]>("requirement-record")
  .attr("description", () => faker.lorem.sentence())
  .attr("title", () => faker.lorem.words(3))
  .attr("levelId", undefined)
  .option("createLevelIfMissing", true)
  .attr("level", ["levelId", "createLevelIfMissing"], (levelId: string, createLevelIfMissing: boolean) => {
    if (levelId || (!createLevelIfMissing && !levelId)) {
      return undefined;
    }

    const requirement: Prisma.LevelCreateNestedOneWithoutRequirementsInput = {
      create: LevelFactory.build(),
    };

    return requirement;
  })
  .attr("ruleId", undefined)
  .option("createRuleIfMissing", true)
  .attr("rule", ["ruleId", "createRuleIfMissing"], (ruleId: string, createRuleIfMissing: boolean) => {
    if (ruleId || (!createRuleIfMissing && !ruleId)) {
      return undefined;
    }

    const rule: Prisma.RuleCreateNestedOneWithoutRequirementsInput = {
      create: RuleFactory.build(),
    };

    return rule;
  });
