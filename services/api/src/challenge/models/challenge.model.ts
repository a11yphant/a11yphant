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
    description: "An array of all levels of the challenge.",
  })
  levels: Level[];
}
