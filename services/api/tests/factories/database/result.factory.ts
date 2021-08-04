import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

import { ResultStatus } from "@/submission/models/result-status.enum";

import { CheckResultFactory } from "./check-result.factory";
import { buildMultipleOf, buildOneOf } from "./helpers";
import { SubmissionFactory } from "./submission.factory";

export const ResultFactory = Factory.define<Prisma.ResultCreateArgs["data"]>("result-record")
  .attr("id", () => faker.datatype.uuid())
  .attr("status", ResultStatus.SUCCESS)
  .attr("submissionId", undefined)
  .option("createSubmissionIfMissing", true)
  .attr(
    "submission",
    ["submissionId", "createSubmissionIfMissing"],
    buildOneOf<typeof SubmissionFactory>(SubmissionFactory, {}, { createResultIfMissing: false }),
  )
  .option("numberOfCheckResults", 2)
  .attr(
    "checkResults",
    ["numberOfCheckResults"],
    buildMultipleOf<typeof CheckResultFactory>(CheckResultFactory, {}, { createResultIfMissing: false }),
  );
