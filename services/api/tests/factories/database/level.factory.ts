import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

export const LevelFactory = Factory.define<Prisma.LevelUncheckedCreateInput>("level-record")
  .attr("instructions", () => faker.lorem.paragraph())
  .attr("html", "<p>hi</p>")
  .attr("css", "body { color: blue }")
  .attr("js", "console.log('hi')");
