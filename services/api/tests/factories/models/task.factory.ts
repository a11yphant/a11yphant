import faker from "faker";
import { Factory } from "rosie";

import { Task } from "../../../src/challenge/models/task.model";

export const TaskFactory = Factory.define<Task>(Task.name, Task)
  .attr("id", () => faker.datatype.uuid())
  .attr("text", () => faker.lorem.sentence());
