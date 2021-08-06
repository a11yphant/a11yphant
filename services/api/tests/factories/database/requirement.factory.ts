import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

import { buildOneOf } from "./helpers";
import { LevelFactory } from "./level.factory";
import { RuleFactory } from "./rule.factory";

export const RequirementFactory = Factory.define<Prisma.RequirementCreateArgs["data"]>("requirement-record")
  .attr("description", () => faker.lorem.sentence())
  .attr("title", () => faker.lorem.words(3))
  .attr("levelId", undefined)
  .option("createLevelIfMissing", true)
  .attr("level", ["levelId", "createLevelIfMissing"], buildOneOf<typeof LevelFactory>(LevelFactory, {}, { numberOfRequirements: 0 }))
  .attr("ruleId", undefined)
  .option("createRuleIfMissing", true)
  .attr("rule", ["ruleId", "createRuleIfMissing"], buildOneOf<typeof RuleFactory>(RuleFactory, {}, { createRequirementIfMissing: false }));
