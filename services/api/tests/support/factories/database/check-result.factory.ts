import { IFactoryStatic } from "rosie";

import { ResultStatus } from "@/submission/graphql/models/result-status.enum";

import { CHECK_RESULT, CODE_LEVEL_RESULT, REQUIREMENT } from "./constants";
import { buildOneOf } from "./helpers";
import { CheckResultData, CodeLevelResultData, RequirementData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<CheckResultData>(CHECK_RESULT)
    .attr("status", ResultStatus.SUCCESS)
    .attr("resultId", undefined)
    .option("createResultIfMissing", true)
    .attr("result", ["resultId", "createResultIfMissing"], buildOneOf<CodeLevelResultData>(CODE_LEVEL_RESULT, {}, { numberOfCheckResults: 0 }))
    .attr("requirementId", undefined)
    .option("createRequirementIfMissing", true)
    .attr("requirement", ["requirementId", "createRequirementIfMissing"], buildOneOf<RequirementData>(REQUIREMENT, {}, { numberOfCheckResults: 0 }));
}
