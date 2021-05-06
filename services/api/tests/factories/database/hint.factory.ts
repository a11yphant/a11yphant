import { Hint } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

export const HintFactory = Factory.define<Hint>("hint-record")
  .attr("id", () => faker.datatype.uuid())
  .attr("text", () => faker.lorem.paragraph());
