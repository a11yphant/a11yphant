import faker from "faker";
import { Factory } from "rosie";

import { Level } from "../../../src/challenge/models/level.model";

export const LevelFactory = Factory.define<Level>(Level.name, Level)
  .attr("id", () => faker.datatype.uuid())
  .attr("instructions", () => faker.lorem.paragraph())
  .attr("code", { html: "<p>hi</p>", css: "body { color: blue }", js: "console.log('hi')" });
