import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Level } from "./level.model";

@ObjectType({
  description: "General and level information for a specific challenge.",
})
export class Challenge {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => [Level], {
    description: "All levels for this challenge.",
  })
  levels: Level[];
}
