import { ArgsType, Field, InputType } from "@nestjs/graphql";

import { ChallengeDifficulty } from "../enums/challenge-difficulty.enum";

@InputType()
export class ChallengesFilter {
  @Field(() => ChallengeDifficulty, { nullable: true, description: "Filter by challenge difficulty." })
  difficulty?: ChallengeDifficulty;
}

@ArgsType()
export class ChallengesArgs {
  @Field(() => ChallengesFilter, { nullable: true, description: "Filter options to get a specific subset of challenges." })
  filter?: ChallengesFilter;
}
