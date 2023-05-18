import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

import { Requirement } from "@/challenge/models/requirement.model";

export const RequirementFactory = Factory.define<Requirement>(Requirement.name, Requirement)
  .attr("id", () => faker.string.uuid())
  .attr("description", () => faker.lorem.sentence())
  .attr("title", () => faker.lorem.words(3));
