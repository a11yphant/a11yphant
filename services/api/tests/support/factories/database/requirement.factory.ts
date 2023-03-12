import { faker } from "@faker-js/faker";
import { IFactoryStatic } from "rosie";

import { CODE_LEVEL, REQUIREMENT, RULE } from "./constants";
import { buildOneOf } from "./helpers";
import { CodeLevelData, RequirementData, RuleData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<RequirementData>(REQUIREMENT)
    .attr("description", () => faker.lorem.sentence())
    .attr("title", () => faker.lorem.words(3))
    .attr("levelId", undefined)
    .option("createLevelIfMissing", true)
    .attr("level", ["levelId", "createLevelIfMissing"], buildOneOf<CodeLevelData>(CODE_LEVEL, {}, { numberOfRequirements: 0 }))
    .attr("ruleId", undefined)
    .option("createRuleIfMissing", true)
    .attr("rule", ["ruleId", "createRuleIfMissing"], buildOneOf<RuleData>(RULE, {}, { createRequirementIfMissing: false }));
}
