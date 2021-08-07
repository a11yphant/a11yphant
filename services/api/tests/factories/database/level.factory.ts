import faker from "faker";
import { IFactoryStatic } from "rosie";

import { CHALLENGE, LEVEL, REQUIREMENT, TASK } from "./constants";
import { buildMultipleOf, buildOneOf } from "./helpers";
import { ChallengeData, LevelData, RequirementData, TaskData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<LevelData>(LEVEL)
    .attr("instructions", () => faker.lorem.paragraph())
    .attr("html", "<p>hi</p>")
    .attr("css", "body { color: blue }")
    .attr("js", "console.log('hi')")
    .attr("order", faker.datatype.number())
    .attr("challengeId", undefined)
    .option("createChallengeIfMissing", true)
    .attr("challenge", ["challengeId", "createChallengeIfMissing"], buildOneOf<ChallengeData>(CHALLENGE, {}, { createLevelIfMissing: false }))
    .option("numberOfRequirements", 0)
    .attr("requirements", ["numberOfRequirements"], buildMultipleOf<RequirementData>(REQUIREMENT, {}, { createLevelIfMissing: false }))
    .option("numberOfTasks", 0)
    .attr("tasks", ["numberOfTasks"], buildMultipleOf<TaskData>(TASK));
}
