import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

export const RuleFactory = Factory.define<Prisma.RuleCreateArgs["data"]>("rule-record")
  .attr("id", () => faker.datatype.uuid())
  .attr("key", () => faker.lorem.slug());
