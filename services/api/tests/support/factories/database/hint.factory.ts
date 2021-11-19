import faker from "faker";
import { IFactoryStatic } from "rosie";

import { HINT } from "./constants";
import { HintData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<HintData>(HINT)
    .attr("id", () => faker.datatype.uuid())
    .attr("text", () => faker.lorem.paragraph());
}
