import { Field, ObjectType } from "@nestjs/graphql";

import { Level } from "./level.model";

@ObjectType({
  implements: () => [Level],
})
export class QuizLevel extends Level {
  constructor(properties: { id: string; order: number; question: string }) {
    super({ id: properties.id, order: properties.order });

    this.question = properties.question;
  }

  @Field(() => String, {
    description: "The question of the quiz level formatted as an HTML string.",
  })
  question: string;
}
