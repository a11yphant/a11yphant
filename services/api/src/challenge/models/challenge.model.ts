import { Field, ID, ObjectType } from "@nestjs/graphql";

import { ChallengeDifficulty } from "../enums/challenge-difficulty.enum";
import { Level } from "./level.model";

@ObjectType({
  description: "General and level information for a specific challenge.",
})
export class Challenge {
  constructor(properties: { id: string; name: string; slug: string; difficulty: ChallengeDifficulty }) {
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

  @Field(() => ChallengeDifficulty)
  difficulty: ChallengeDifficulty;

  @Field(() => [Level], {
    description: "All levels for this challenge.",
  })
  levels: Level[];
}
