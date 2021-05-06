import { Task } from "@prisma/client";
import faker from "faker";
import { Factory } from "rosie";

export const TaskFactory = Factory.define<Task>("task-record")
  .attr("id", () => faker.datatype.uuid())
  .attr("text", () => faker.lorem.paragraph());
