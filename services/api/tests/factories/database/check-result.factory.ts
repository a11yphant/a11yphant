import faker from "faker";
import { Factory } from "rosie";

import { CheckResult } from ".prisma/client";

export const CheckResultFactory = Factory.define<CheckResult>("check-result-record")
  .attr("id", () => faker.datatype.uuid())
  .attr("status", 1)
  .attr("requirementId", () => faker.datatype.uuid())
  .attr("resultId", () => faker.datatype.uuid());
