import { Args, ID, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { ChallengeService } from "./challenge.service";
import { LevelService } from "./level.service";
import { Challenge } from "./models/challenge.model";
import { Level } from "./models/level.model";

@Resolver(() => Challenge)
export class ChallengeResolver {
  constructor(private readonly challengeService: ChallengeService, private readonly levelService: LevelService) {}

  @Query(() => Challenge, { nullable: true })
  async challenge(@Args("id", { type: () => ID }) id: string): Promise<Challenge> {
    return this.challengeService.findOne(id);
  }

  @ResolveField()
  async levels(@Parent() challenge: Challenge): Promise<Level[]> {
    return this.levelService.findForChallenge(challenge.id);
  }
}
