import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

import { CodeLevel } from "@/challenge/models/code-level.model";

export const CodeLevelFactory = Factory.define<CodeLevel>(CodeLevel.name, CodeLevel)
  .attr("id", () => faker.datatype.uuid())
  .attr("instructions", () => faker.lorem.paragraph())
  .attr("code", { html: "<p>hi</p>", css: "body { color: blue }", js: "console.log('hi')" })
  .attr("hasHtmlEditor", true)
  .attr("hasCssEditor", false)
  .attr("hasJsEditor", false);
