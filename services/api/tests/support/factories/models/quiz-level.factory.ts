import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

import { QuizLevel } from "@/challenge/models/quiz-level.model";

export const QuizLevelFactory = Factory.define<QuizLevel>(QuizLevel.name, QuizLevel)
  .attr("id", () => faker.string.uuid())
  .attr("order", () => faker.number.int({ min: 0, max: 100 }))
  .attr("question", () => faker.lorem.sentence());
