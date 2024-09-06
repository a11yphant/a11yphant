import { faker } from "@faker-js/faker";
import { IFactoryStatic } from "rosie";

import { HINT } from "./constants";
import { HintData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<HintData>(HINT)
    .attr("id", () => faker.string.uuid())
    .attr("text", () => faker.lorem.paragraph());
}
