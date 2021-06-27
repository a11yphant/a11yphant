import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

import { LevelFactory } from "./level.factory";

export const ChallengeFactory = Factory.define<Prisma.ChallengeCreateArgs["data"]>("challenge-record")
  .attr("slug", () => faker.lorem.slug())
  .attr("name", () => faker.lorem.words(3))
  .option("numberOfLevels", 0)
  .attr("levels", ["numberOfLevels"], (numberOfLevels = 0) => {
    if (numberOfLevels === 0) {
      return undefined;
    }

    const levels: Prisma.LevelCreateNestedManyWithoutChallengeInput = {
      create: LevelFactory.buildList(numberOfLevels, {}, { createChallengeIfMissing: false }),
    };

    return levels;
  });
