import { Args, ID, Query, Resolver } from "@nestjs/graphql";

import { Challenge } from "./models/challenge.model";
import { ChallengeService } from "./static-challenge.service";

@Resolver()
export class ChallengeResolver {
  constructor(private readonly challengeService: ChallengeService) {}

  @Query(() => Challenge)
  async challenge(@Args("id", { type: () => ID }) id: string): Promise<Challenge> {
    return this.challengeService.findOne();
  }
}
