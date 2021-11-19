import faker from "faker";
import { Factory } from "rosie";

import { Hint } from "@/challenge/models/hint.model";

export const HintFactory = Factory.define<Hint>(Hint.name, Hint)
  .attr("id", () => faker.datatype.uuid())
  .attr("text", () => faker.lorem.sentence());
