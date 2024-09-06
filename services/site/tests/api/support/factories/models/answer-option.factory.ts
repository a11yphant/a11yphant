import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

import { AnswerOption } from "@/challenge/models/answer-option.model";

export const AnswerOptionFactory = Factory.define<AnswerOption>(AnswerOption.name, AnswerOption)
  .attr("id", () => faker.string.uuid())
  .attr("text", () => faker.lorem.sentence())
  .attr("correct", () => faker.datatype.boolean());
