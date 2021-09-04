import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { SessionToken } from "@/authentication/session-token.decorator";
import { SessionToken as SessionTokenInterface } from "@/authentication/session-token.interface";
import { Submission } from "@/submission/graphql/models/submission.model";
import { SubmissionService } from "@/submission/services/submission.service";

import { LevelByChallengeSlugAndIndexArgs } from "./arg-types/level-by-challenge-slug-and-index.args";
import { LevelService } from "./level.service";
import { Level } from "./models/level.model";
import { Requirement } from "./models/requirement.model";
import { Task } from "./models/task.model";
import { RequirementService } from "./requirement.service";
import { TaskService } from "./task.service";

@Resolver(() => Level)
export class LevelResolver {
  constructor(
    private levelService: LevelService,
    private requirementService: RequirementService,
    private taskService: TaskService,
    private submissionService: SubmissionService,
  ) {}

  @Query(() => Level, { nullable: true })
  async levelByChallengeSlug(@Args() { challengeSlug, nth }: LevelByChallengeSlugAndIndexArgs): Promise<Level> {
    return this.levelService.findOneForChallengeAtIndex(challengeSlug, nth - 1);
  }

  @ResolveField(() => [Requirement])
  async requirements(@Parent() level: Level): Promise<Requirement[]> {
    return this.requirementService.findForLevel(level.id);
  }

  @ResolveField(() => [Task], {
    description: "The tasks that need to be solved for this level.",
  })
  async tasks(@Parent() level: Level): Promise<Task[]> {
    return this.taskService.findForLevel(level.id);
  }

  @ResolveField(() => Submission, { nullable: true, description: "The last submission of the current user for this level" })
  lastSubmission(@Parent() level: Level, @SessionToken() sessionToken: SessionTokenInterface): Promise<Submission> {
    return this.submissionService.findLastForUserAndLevel(sessionToken.userId, level.id);
  }
}
