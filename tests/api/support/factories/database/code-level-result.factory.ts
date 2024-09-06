import { faker } from "@faker-js/faker";
import { IFactoryStatic } from "rosie";

import { ResultStatus } from "@/submission/graphql/models/result-status.enum";

import { CHECK_RESULT, CODE_LEVEL_RESULT, CODE_LEVEL_SUBMISSION } from "./constants";
import { buildMultipleOf, buildOneOf } from "./helpers";
import { CheckResultData, CodeLevelResultData, CodeLevelSubmissionData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<CodeLevelResultData>(CODE_LEVEL_RESULT)
    .attr("id", () => faker.string.uuid())
    .attr("status", ResultStatus.SUCCESS)
    .attr("submissionId", undefined)
    .option("createSubmissionIfMissing", true)
    .attr(
      "submission",
      ["submissionId", "createSubmissionIfMissing"],
      buildOneOf<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, {}, { createResultIfMissing: false }),
    )
    .option("numberOfCheckResults", 2)
    .attr(
      "checkResults",
      ["numberOfCheckResults"],
      buildMultipleOf<CheckResultData>(CHECK_RESULT, {}, { createResultIfMissing: false }) as unknown as any,
    );
}
