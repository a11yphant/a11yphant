import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

import { buildMultipleOf } from "./helpers";
import { HintFactory } from "./hint.factory";

export const TaskFactory = Factory.define<Prisma.TaskCreateArgs["data"]>("task-record")
  .attr("id", () => faker.datatype.uuid())
  .attr("text", () => faker.lorem.paragraph())
  .option("numberOfHints", 2)
  .attr("hints", ["numberOfHints"], buildMultipleOf<typeof HintFactory>(HintFactory));
