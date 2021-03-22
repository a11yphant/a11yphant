import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { HintService } from "./hint.service";
import { LevelService } from "./level.service";
import { Hint } from "./models/hint.model";
import { Level } from "./models/level.model";
import { Requirement } from "./models/requirement.model";
import { Resource } from "./models/resource.model";
import { RequirementService } from "./requirement.service";
import { ResourceService } from "./resource.service";

@Resolver(() => Level)
export class LevelResolver {
  constructor(
    private levelService: LevelService,
    private requirementService: RequirementService,
    private hintService: HintService,
    private resourceService: ResourceService,
  ) {}

  @Query(() => Level, { nullable: true })
  async levelByChallengeSlugAndIndex(
    @Args("challengeSlug", { type: () => String }) challengeSlug: string,
    @Args("index", { type: () => Int }) index: number,
  ): Promise<Level> {
    return this.levelService.findOneForChallengeAtIndex(challengeSlug, index);
  }

  @ResolveField()
  async requirements(@Parent() level: Level): Promise<Requirement[]> {
    return this.requirementService.findForLevel(level.id);
  }

  @ResolveField()
  async hints(@Parent() level: Level): Promise<Hint[]> {
    return this.hintService.findForLevel(level.id);
  }

  @ResolveField()
  async resources(@Parent() level: Level): Promise<Resource[]> {
    return this.resourceService.findForLevel(level.id);
  }
}
