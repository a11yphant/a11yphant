import faker from "faker";
import { Factory } from "rosie";

import { Result } from "../../../src/submission/models/result.model";
import { ResultStatus } from "../../../src/submission/models/result-status.enum";

export const ResultFactory = Factory.define<Result>(Result.name, Result)
  .attr("id", () => faker.datatype.uuid())
  .attr("status", ResultStatus.SUCCESS)
  .attr("requirements", [])
  .attr("submissionId", () => faker.datatype.uuid());
