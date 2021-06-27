import { Factory } from "rosie";

import { ResultStatus } from "@/submission/models/result-status.enum";

import { RequirementFactory } from "./requirement.factory";
import { ResultFactory } from "./result.factory";
import { Prisma } from ".prisma/client";

export const CheckResultFactory = Factory.define<Prisma.CheckResultCreateArgs["data"]>("check-result-record")
  .attr("status", ResultStatus.SUCCESS)
  .attr("resultId", undefined)
  .option("createResultIfMissing", true)
  .attr("result", ["resultId", "createResultIfMissing"], (resultId: string, createResultIfMissing: boolean) => {
    if (resultId || (!createResultIfMissing && !resultId)) {
      return undefined;
    }

    const result: Prisma.ResultCreateNestedOneWithoutCheckResultsInput = {
      create: ResultFactory.build(),
    };

    return result;
  })
  .attr("requirementId", undefined)
  .option("createRequirementIfMissing", true)
  .attr("requirement", ["requirementId", "createRequirementIfMissing"], (requirementId: string, createRequirementIfMissing: boolean) => {
    if (requirementId || (!createRequirementIfMissing && !requirementId)) {
      return undefined;
    }

    const requirement: Prisma.RequirementCreateNestedOneWithoutCheckResultInput = {
      create: RequirementFactory.build(),
    };

    return requirement;
  });
