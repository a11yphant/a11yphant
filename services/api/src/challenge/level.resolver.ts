import { Args, Query, Resolver } from "@nestjs/graphql";

import { LevelByChallengeSlugAndIndexArgs } from "./arg-types/level-by-challenge-slug-and-index.args";
import { LevelService } from "./level.service";
import { Level } from "./models/level.model";

@Resolver(() => Level)
export class LevelResolver {
  constructor(private readonly levelService: LevelService) {}

  @Query(() => Level, { nullable: true })
  async levelByChallengeSlug(@Args() { challengeSlug, nth }: LevelByChallengeSlugAndIndexArgs): Promise<Level> {
    return this.levelService.findOneForChallengeAtIndex(challengeSlug, nth - 1);
  }
}
