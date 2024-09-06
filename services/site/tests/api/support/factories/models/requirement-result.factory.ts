import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

import { RequirementResult } from "@/submission/graphql/models/requirement-result.model";

export const RequirementResultFactory = Factory.define<RequirementResult>(RequirementResult.name, RequirementResult)
  .attr("id", () => faker.string.uuid())
  .attr("description", () => faker.lorem.sentence())
  .attr("title", () => faker.lorem.words(3))
  .attr("requirementId", () => faker.string.uuid());
