import { Requirement } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

export const RequirementFactory = Factory.define<Requirement>("requirement-record")
  .attr("id", () => faker.datatype.uuid())
  .attr("description", () => faker.lorem.sentence())
  .attr("title", () => faker.lorem.words(3));
