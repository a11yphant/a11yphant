import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

import { ChallengeFactory } from "./challenge.factory";
import { buildMultipleOf, buildOneOf } from "./helpers";
import { RequirementFactory } from "./requirement.factory";
import { TaskFactory } from "./task.factory";

export const LevelFactory = Factory.define<Prisma.LevelCreateArgs["data"]>("level-record")
  .attr("instructions", () => faker.lorem.paragraph())
  .attr("html", "<p>hi</p>")
  .attr("css", "body { color: blue }")
  .attr("js", "console.log('hi')")
  .attr("order", faker.datatype.number())
  .attr("challengeId", undefined)
  .option("createChallengeIfMissing", true)
  .attr(
    "challenge",
    ["challengeId", "createChallengeIfMissing"],
    buildOneOf<typeof ChallengeFactory>(ChallengeFactory, {}, { createLevelIfMissing: false }),
  )
  .option("numberOfRequirements", 0)
  .attr("requirements", ["numberOfRequirements"], buildMultipleOf<typeof RequirementFactory>(RequirementFactory, {}, { createLevelIfMissing: false }))
  .option("numberOfTasks", 0)
  .attr("tasks", ["numberOfTasks"], buildMultipleOf<typeof TaskFactory>(TaskFactory));
