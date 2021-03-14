import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Level } from "./level.model";

@ObjectType({
  description: "General and level information for a specific challenge.",
})
export class Challenge {
  constructor(properties: { id: string; name: string }) {
    this.id = properties.id;
    this.name = properties.name;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => [Level], {
    description: "All levels for this challenge.",
  })
  levels: Level[];
}
