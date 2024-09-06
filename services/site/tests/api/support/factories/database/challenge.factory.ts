import { faker } from "@faker-js/faker";
import { IFactoryStatic } from "rosie";

import { ChallengeDifficulty } from "@/challenge/enums/challenge-difficulty.enum";

import { QUIZ_LEVEL, QuizLevelData } from ".";
import { CHALLENGE, CODE_LEVEL } from "./constants";
import { buildMultipleOf } from "./helpers";
import { ChallengeData, CodeLevelData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<ChallengeData>(CHALLENGE)
    .attr("slug", () => faker.lorem.slug())
    .attr("name", () => faker.lorem.words(3))
    .attr("difficulty", () => faker.helpers.arrayElement([ChallengeDifficulty.EASY, ChallengeDifficulty.MEDIUM, ChallengeDifficulty.HARD]))
    .option("numberOfCodeLevels", 0)
    .attr("codeLevels", ["numberOfCodeLevels"], buildMultipleOf<CodeLevelData>(CODE_LEVEL, {}, { createChallengeIfMissing: false }))
    .option("numberOfQuizLevels", 0)
    .attr("quizLevels", ["numberOfQuizLevels"], buildMultipleOf<QuizLevelData>(QUIZ_LEVEL, {}, { createChallengeIfMissing: false }));
}
