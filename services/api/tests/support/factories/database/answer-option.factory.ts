import { faker } from "@faker-js/faker";
import { IFactoryStatic } from "rosie";

import { ANSWER_OPTION, QUIZ_LEVEL } from "./constants";
import { buildOneOf } from "./helpers";
import { AnswerOptionData, QuizLevelData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<AnswerOptionData>(ANSWER_OPTION)
    .attr("id", () => faker.string.uuid())
    .attr("text", () => faker.lorem.paragraph())
    .attr("correct", () => faker.datatype.boolean())
    .attr("quizLevelId", undefined)
    .option("createQuizLevelIfMissing", true)
    .attr("quizLevel", ["quizLevelId", "createQuizLevelIfMissing"], buildOneOf<QuizLevelData>(QUIZ_LEVEL, {}, { numberOfAnswerOptions: 0 }));
}
