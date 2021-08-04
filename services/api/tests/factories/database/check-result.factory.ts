import { Prisma } from "@prisma/client";
import { Factory } from "rosie";

import { ResultStatus } from "@/submission/models/result-status.enum";

import { buildOneOf } from "./helpers";
import { RequirementFactory } from "./requirement.factory";
import { ResultFactory } from "./result.factory";

export const CheckResultFactory = Factory.define<Prisma.CheckResultCreateArgs["data"]>("check-result-record")
  .attr("status", ResultStatus.SUCCESS)
  .attr("resultId", undefined)
  .option("createResultIfMissing", true)
  .attr("result", ["resultId", "createResultIfMissing"], buildOneOf<typeof ResultFactory>(ResultFactory, {}, { numberOfCheckResults: 0 }))
  .attr("requirementId", undefined)
  .option("createRequirementIfMissing", true)
  .attr(
    "requirement",
    ["requirementId", "createRequirementIfMissing"],
    buildOneOf<typeof RequirementFactory>(RequirementFactory, {}, { numberOfCheckResults: 0 }),
  );
