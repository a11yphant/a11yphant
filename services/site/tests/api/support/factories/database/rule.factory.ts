import { faker } from "@faker-js/faker";
import { IFactoryStatic } from "rosie";

import { RULE } from "./constants";
import { RuleData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<RuleData>(RULE)
    .attr("id", () => faker.string.uuid())
    .attr("key", () => faker.lorem.slug());
}
