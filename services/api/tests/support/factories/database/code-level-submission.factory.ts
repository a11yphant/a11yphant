import { IFactoryStatic } from "rosie";

import { CODE_LEVEL, CODE_LEVEL_SUBMISSION, USER } from "./constants";
import { buildOneOf } from "./helpers";
import { CodeLevelData, CodeLevelSubmissionData, UserData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION)
    .attr("html", "<p>hi</p>")
    .attr("css", "body { color: blue }")
    .attr("js", "console.log('hi')")
    .attr("userId", undefined)
    .option("createUserIfMissing", true)
    .attr("levelId", undefined)
    .option("createLevelIfMissing", true)
    .attr("level", ["levelId", "createLevelIfMissing"], buildOneOf<CodeLevelData>(CODE_LEVEL, {}, { createSubmissionIfMissing: false }))
    .attr("user", ["userId", "createUserIfMissing"], buildOneOf<UserData>(USER, {}));
}
