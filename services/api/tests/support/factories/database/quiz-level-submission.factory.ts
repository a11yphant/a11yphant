import { IFactoryStatic } from "rosie";

import { QUIZ_LEVEL, QUIZ_LEVEL_SUBMISSION, QuizLevelData, QuizLevelSubmissionData, USER, UserData } from ".";
import { buildOneOf } from "./helpers";

export function define(factory: IFactoryStatic): void {
  factory
    .define<QuizLevelSubmissionData>(QUIZ_LEVEL_SUBMISSION)
    .attr("levelId", undefined)
    .option("createLevelIfMissing", true)
    .attr("level", ["levelId", "createLevelIfMissing"], buildOneOf<QuizLevelData>(QUIZ_LEVEL, {}, { createSubmissionIfMissing: false }))
    .attr("userId", undefined)
    .option("createUserIfMissing", true)
    .attr("user", ["userId", "createUserIfMissing"], buildOneOf<UserData>(USER));
}
