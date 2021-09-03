import faker from "faker";
import { IFactoryStatic } from "rosie";

import { ResultStatus } from "@/submission/graphql/models/result-status.enum";

import { CHECK_RESULT, RESULT, SUBMISSION } from "./constants";
import { buildMultipleOf, buildOneOf } from "./helpers";
import { CheckResultData, ResultData, SubmissionData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<ResultData>(RESULT)
    .attr("id", () => faker.datatype.uuid())
    .attr("status", ResultStatus.SUCCESS)
    .attr("submissionId", undefined)
    .option("createSubmissionIfMissing", true)
    .attr("submission", ["submissionId", "createSubmissionIfMissing"], buildOneOf<SubmissionData>(SUBMISSION, {}, { createResultIfMissing: false }))
    .option("numberOfCheckResults", 2)
    .attr(
      "checkResults",
      ["numberOfCheckResults"],
      buildMultipleOf<CheckResultData>(CHECK_RESULT, {}, { createResultIfMissing: false }) as unknown as any,
    );
}
