import { Field, ID, ObjectType } from "@nestjs/graphql";

import { ChallengeDifficulty } from "../enums/challenge-difficulty.enum";

@ObjectType({
  description: "General and level information for a specific challenge.",
})
export class Challenge {
  constructor(properties: { id: string; name: string; slug: string; difficulty: ChallengeDifficulty; introduction: string }) {
    this.id = properties.id;
    this.slug = properties.slug;
    this.name = properties.name;
    this.difficulty = properties.difficulty;
    this.introduction = properties.introduction;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  slug: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  introduction: string;

  @Field(() => ChallengeDifficulty)
  difficulty: ChallengeDifficulty;

  @Field(() => Boolean)
  isMobileFriendly: boolean;
}
