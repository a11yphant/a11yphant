import { faker } from "@faker-js/faker";
import { IFactoryStatic } from "rosie";

import { HINT, TASK } from "./constants";
import { buildMultipleOf } from "./helpers";
import { HintData, TaskData } from "./types";

export function define(factory: IFactoryStatic): void {
  factory
    .define<TaskData>(TASK)
    .attr("id", () => faker.datatype.uuid())
    .attr("text", () => faker.lorem.paragraph())
    .option("numberOfHints", 2)
    .attr("hints", ["numberOfHints"], buildMultipleOf<HintData>(HINT));
}
