import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Hint } from "./hint.model";

@ObjectType()
export class Task {
  constructor(properties: { id: string; text: string }) {
    this.id = properties.id;
    this.text = properties.text;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  text: string;

  @Field(() => [Hint], { description: "All hints available for this task." })
  hints: Hint[];
}
