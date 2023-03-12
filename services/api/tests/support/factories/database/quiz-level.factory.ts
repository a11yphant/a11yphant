import { faker } from "@faker-js/faker";
import { IFactoryStatic } from "rosie";

import { ANSWER_OPTION, CHALLENGE, QUIZ_LEVEL } from "./constants";
import { buildMultipleOf, buildOneOf } from "./helpers";
import { AnswerOptionData, ChallengeData, QuizLevelData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<QuizLevelData>(QUIZ_LEVEL)
    .attr("order", faker.datatype.number())
    .attr("question", faker.lorem.sentence())
    .attr("challengeId", undefined)
    .option("createChallengeIfMissing", true)
    .attr("challenge", ["challengeId", "createChallengeIfMissing"], buildOneOf<ChallengeData>(CHALLENGE, {}, {}))
    .option("numberOfAnswerOptions", 2)
    .attr("answerOptions", ["numberOfAnswerOptions"], buildMultipleOf<AnswerOptionData>(ANSWER_OPTION, {}, { createQuizLevelIfMissing: false }));
}
