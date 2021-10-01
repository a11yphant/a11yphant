import { IFactoryStatic } from "rosie";

import { CODE_LEVEL, SUBMISSION } from "./constants";
import { buildOneOf } from "./helpers";
import { CodeLevelData, SubmissionData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<SubmissionData>(SUBMISSION)
    .attr("html", "<p>hi</p>")
    .attr("css", "body { color: blue }")
    .attr("js", "console.log('hi')")
    .attr("levelId", undefined)
    .option("createLevelIfMissing", true)
    .attr("level", ["levelId", "createLevelIfMissing"], buildOneOf<CodeLevelData>(CODE_LEVEL, {}, { createSubmissionIfMissing: false }));
}
