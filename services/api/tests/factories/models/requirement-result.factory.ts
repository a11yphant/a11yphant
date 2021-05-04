import faker from "faker";
import { Factory } from "rosie";

import { RequirementResult } from "../../../src/submission/models/requirement-result.model";

export const RequirementResultFactory = Factory.define<RequirementResult>(RequirementResult.name, RequirementResult)
  .attr("id", () => faker.datatype.uuid())
  .attr("description", () => faker.lorem.sentence())
  .attr("title", () => faker.lorem.words(3));
