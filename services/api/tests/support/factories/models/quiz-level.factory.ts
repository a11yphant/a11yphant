import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

import { QuizLevel } from "@/challenge/models/quiz-level.model";

export const QuizLevelFactory = Factory.define<QuizLevel>(QuizLevel.name, QuizLevel)
  .attr("id", () => faker.datatype.uuid())
  .attr("order", () => faker.datatype.number())
  .attr("question", () => faker.lorem.sentence());
