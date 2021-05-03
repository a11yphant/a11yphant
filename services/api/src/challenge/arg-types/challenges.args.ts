import { ArgsType, Field, InputType } from "@nestjs/graphql";

import { ChallengeDifficulty } from "../enums/challenge-difficulty.enum";

@InputType()
export class ChallengesFilter {
  @Field(() => ChallengeDifficulty, { nullable: true })
  difficulty?: ChallengeDifficulty;
}

@ArgsType()
export class ChallengesArgs {
  @Field(() => ChallengesFilter, { nullable: true })
  filter?: ChallengesFilter;
}
