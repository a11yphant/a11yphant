import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

import { ResultStatus } from "@/submission/models/result-status.enum";

import { SubmissionFactory } from "./submission.factory";

export const ResultFactory = Factory.define<Prisma.ResultCreateArgs["data"]>("result-record")
  .attr("id", () => faker.datatype.uuid())
  .attr("status", ResultStatus.SUCCESS)
  .attr("submissionId", undefined)
  .option("createSubmissionIfMissing", true)
  .attr("submission", ["submissionId", "createSubmissionIfMissing"], (submissionId: string, createSubmissionIfMissing: boolean) => {
    if (submissionId || (!createSubmissionIfMissing && !submissionId)) {
      return undefined;
    }

    const submission: Prisma.SubmissionCreateNestedOneWithoutResultInput = {
      create: SubmissionFactory.build(),
    };

    return submission;
  });
