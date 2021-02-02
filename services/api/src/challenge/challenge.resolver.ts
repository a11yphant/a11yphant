import { Query, Resolver } from "@nestjs/graphql";

import { Challenge } from "./models/challenge.model";
import { ChallengeService } from "./static-challenge.service";

@Resolver()
export class ChallengeResolver {
  constructor(private readonly challengeService: ChallengeService) {}

  @Query(() => Challenge)
  async challenge(): Promise<Challenge> {
    return this.challengeService.find();
  }
}
