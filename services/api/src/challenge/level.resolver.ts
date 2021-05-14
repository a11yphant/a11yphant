import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { LevelByChallengeSlugAndIndexArgs } from "./arg-types/level-by-challenge-slug-and-index.args";
import { LevelService } from "./level.service";
import { Level } from "./models/level.model";
import { Requirement } from "./models/requirement.model";
import { Task } from "./models/task.model";
import { RequirementService } from "./requirement.service";
import { TaskService } from "./task.service";

@Resolver(() => Level)
export class LevelResolver {
  constructor(private levelService: LevelService, private requirementService: RequirementService, private taskService: TaskService) {}

  @Query(() => Level, { nullable: true })
  async levelByChallengeSlug(@Args() { challengeSlug, nth }: LevelByChallengeSlugAndIndexArgs): Promise<Level> {
    return this.levelService.findOneForChallengeAtIndex(challengeSlug, nth - 1);
  }

  @ResolveField()
  async requirements(@Parent() level: Level): Promise<Requirement[]> {
    return this.requirementService.findForLevel(level.id);
  }

  @ResolveField()
  async tasks(@Parent() level: Level): Promise<Task[]> {
    return this.taskService.findForLevel(level.id);
  }
}
