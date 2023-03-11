import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

import { Rule } from "@/challenge/models/rule.model";

export const RuleFactory = Factory.define<Rule>(Rule.name, Rule)
  .attr("id", () => faker.datatype.uuid())
  .attr("key", () => faker.lorem.slug());
