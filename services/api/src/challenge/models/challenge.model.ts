import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Level } from "./level.model";

export enum challengeDifficulty {
  EASY,
  MEDIUM,
  HARD,
}

@ObjectType({
  description: "General and level information for a specific challenge.",
})
export class Challenge {
  constructor(properties: { id: string; name: string; slug: string; difficulty: challengeDifficulty }) {
    this.id = properties.id;
    this.slug = properties.slug;
    this.name = properties.name;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  slug: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  difficulty: challengeDifficulty;

  @Field(() => [Level], {
    description: "All levels for this challenge.",
  })
  levels: Level[];
}
