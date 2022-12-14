import faker from "faker";
import { Factory } from "rosie";

import { AnswerOption } from "@/challenge/models/answer-option.model";

export const AnswerOptionFactory = Factory.define<AnswerOption>(AnswerOption.name, AnswerOption)
  .attr("id", () => faker.datatype.uuid())
  .attr("text", () => faker.lorem.sentence())
  .attr("correct", () => faker.datatype.boolean());
