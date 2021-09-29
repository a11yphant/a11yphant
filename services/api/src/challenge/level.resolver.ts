import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { SessionToken } from "@/authentication/session-token.decorator";

import { LevelByChallengeSlugAndIndexArgs } from "./arg-types/level-by-challenge-slug-and-index.args";
import { LevelStatus } from "./enums/level-status.enum";
import { LevelService } from "./level.service";
import { CodeLevel } from "./models/code-level.model";
import { Level } from "./models/level.model";

@Resolver(() => Level)
export class LevelResolver {
  constructor(private readonly levelService: LevelService) {}

  @Query(() => CodeLevel, { nullable: true })
  async levelByChallengeSlug(@Args() { challengeSlug, nth }: LevelByChallengeSlugAndIndexArgs): Promise<Level> {
    return this.levelService.findOneForChallengeAtIndex(challengeSlug, nth - 1);
  }

  @ResolveField(() => LevelStatus, { description: "The status of the level for the current user." })
  status(@Parent() level: Level, @SessionToken() sessionToken: SessionTokenInterface): Promise<LevelStatus> {
    return this.levelService.findStatusForUserAndLevel(sessionToken.userId, level.id);
  }
}
