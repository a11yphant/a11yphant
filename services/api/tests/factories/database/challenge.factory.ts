import faker from "faker";
import { IFactoryStatic } from "rosie";

import { ChallengeDifficulty } from "@/challenge/enums/challenge-difficulty.enum";

import { CHALLENGE, LEVEL } from "./constants";
import { buildMultipleOf } from "./helpers";
import { ChallengeData, LevelData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<ChallengeData>(CHALLENGE)
    .attr("slug", () => faker.lorem.slug())
    .attr("name", () => faker.lorem.words(3))
    .attr("difficulty", () => faker.random.arrayElement([ChallengeDifficulty.EASY, ChallengeDifficulty.MEDIUM, ChallengeDifficulty.HARD]))
    .option("numberOfLevels", 0)
    .attr("codeLevels", ["numberOfLevels"], buildMultipleOf<LevelData>(LEVEL, {}, { createChallengeIfMissing: false }));
}
