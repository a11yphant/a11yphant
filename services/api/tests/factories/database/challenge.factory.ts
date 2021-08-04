import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

import { ChallengeDifficulty } from "@/challenge/enums/challenge-difficulty.enum";

import { buildMultipleOf } from "./helpers";
import { LevelFactory } from "./level.factory";

export const ChallengeFactory = Factory.define<Prisma.ChallengeCreateArgs["data"]>("challenge-record")
  .attr("slug", () => faker.lorem.slug())
  .attr("name", () => faker.lorem.words(3))
  .attr("difficulty", () => faker.random.arrayElement([ChallengeDifficulty.EASY, ChallengeDifficulty.MEDIUM, ChallengeDifficulty.HARD]))
  .option("numberOfLevels", 0)
  .attr("levels", ["numberOfLevels"], buildMultipleOf<typeof LevelFactory>(LevelFactory, {}, { createChallengeIfMissing: false }));
