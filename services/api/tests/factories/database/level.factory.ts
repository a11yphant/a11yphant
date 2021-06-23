import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

import { ChallengeFactory } from "./challenge.factory";
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
  .attr("challenge", ["challengeId", "createChallengeIfMissing"], (challengeId: string, createChallengeIfMissing: boolean) => {
    if (challengeId || (!createChallengeIfMissing && !challengeId)) {
      return undefined;
    }

    const challenge: Prisma.ChallengeCreateNestedOneWithoutLevelsInput = {
      create: ChallengeFactory.build(),
    };

    return challenge;
  })
  .option("numberOfRequirements", 0)
  .attr("requirements", ["numberOfRequirements"], (numberOfRequirements: number) => {
    if (numberOfRequirements === 0) {
      return undefined;
    }

    const levels: Prisma.RequirementCreateNestedManyWithoutLevelInput = {
      createMany: {
        data: RequirementFactory.buildList(numberOfRequirements),
      },
    };

    return levels;
  })
  .option("numberOfTasks", 0)
  .attr("tasks", ["numberOfTasks"], (numberOfTasks: number) => {
    if (numberOfTasks === 0) {
      return undefined;
    }

    const levels: Prisma.TaskCreateNestedManyWithoutLevelInput = {
      createMany: {
        data: TaskFactory.buildList(numberOfTasks),
      },
    };

    return levels;
  });
