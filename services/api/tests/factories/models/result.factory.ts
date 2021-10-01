import faker from "faker";
import { Factory } from "rosie";

import { Result } from "@/submission/graphql/models/result.model";
import { ResultStatus } from "@/submission/graphql/models/result-status.enum";

export const ResultFactory = Factory.define<Result>(Result.name, Result)
  .attr("id", () => faker.datatype.uuid())
  .attr("status", ResultStatus.SUCCESS)
  .attr("submissionId", () => faker.datatype.uuid());
