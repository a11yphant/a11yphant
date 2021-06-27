import { Prisma } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

export const TaskFactory = Factory.define<Prisma.TaskCreateArgs["data"]>("task-record")
  .attr("id", () => faker.datatype.uuid())
  .attr("text", () => faker.lorem.paragraph());
