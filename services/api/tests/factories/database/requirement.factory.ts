import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

import { LevelFactory } from "./level.factory";

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
  });
