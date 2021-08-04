import { Hint } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

export const HINT_RECORD_FACTORY = "hint-record";

export const HintFactory = Factory.define<Hint>(HINT_RECORD_FACTORY)
  .attr("id", () => faker.datatype.uuid())
  .attr("text", () => faker.lorem.paragraph());

export type HintFactoryType = typeof HintFactory;
