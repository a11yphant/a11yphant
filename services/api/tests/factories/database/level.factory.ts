import { Level } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

export const LevelFactory = Factory.define<Level>("level-record")
  .attr("id", () => faker.datatype.uuid())
  .attr("tldr", () => faker.lorem.sentence())
  .attr("instructions", () => faker.lorem.paragraph())
  .attr("html", "<p>hi</p>")
  .attr("css", "body { color: blue }")
  .attr("js", "console.log('hi')")
  .attr("challengeId", () => faker.datatype.uuid());
