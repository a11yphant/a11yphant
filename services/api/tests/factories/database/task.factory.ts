import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

import { HintFactory } from "./hint.factory";

export const TaskFactory = Factory.define<Prisma.TaskCreateArgs["data"]>("task-record")
  .attr("id", () => faker.datatype.uuid())
  .attr("text", () => faker.lorem.paragraph())
  .option("numberOfHints", 2)
  .attr("hints", ["numberOfHints"], (numberOfHints: number) => {
    if (numberOfHints === 0) {
      return undefined;
    }

    const hints: Prisma.HintCreateNestedManyWithoutTaskInput = {
      create: HintFactory.buildList(numberOfHints),
    };

    return hints;
  });
