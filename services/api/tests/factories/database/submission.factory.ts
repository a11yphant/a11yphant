import { IFactoryStatic } from "rosie";

import { LEVEL, SUBMISSION } from "./constants";
import { buildOneOf } from "./helpers";
import { LevelData, SubmissionData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<SubmissionData>(SUBMISSION)
    .attr("html", "<p>hi</p>")
    .attr("css", "body { color: blue }")
    .attr("js", "console.log('hi')")
    .attr("levelId", undefined)
    .option("createLevelIfMissing", true)
    .attr("level", ["levelId", "createLevelIfMissing"], buildOneOf<LevelData>(LEVEL, {}, { createSubmissionIfMissing: false }));
}
