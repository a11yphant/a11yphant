import { Result } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

export const ResultFactory = Factory.define<Result>("result-record")
  .attr("id", () => faker.datatype.uuid())
  .attr("submissionId", () => faker.datatype.uuid());
