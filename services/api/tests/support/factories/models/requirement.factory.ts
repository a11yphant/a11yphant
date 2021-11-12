import faker from "faker";
import { Factory } from "rosie";

import { Requirement } from "../../../../src/challenge/models/requirement.model";

export const RequirementFactory = Factory.define<Requirement>(Requirement.name, Requirement)
  .attr("id", () => faker.datatype.uuid())
  .attr("description", () => faker.lorem.sentence())
  .attr("title", () => faker.lorem.words(3));
