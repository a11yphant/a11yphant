import { Rule } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

export const RuleFactory = Factory.define<Rule>("rule-record")
  .attr("id", () => faker.datatype.uuid())
  .attr("key", () => faker.lorem.slug());
