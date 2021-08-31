import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { SessionToken } from "@/authentication/session-token.decorator";
import { Submission } from "@/submission/models/submission.model";
import { SubmissionService } from "@/submission/submission.service";

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

  @ResolveField()
  async requirements(@Parent() level: Level): Promise<Requirement[]> {
    return this.requirementService.findForLevel(level.id);
  }

  @ResolveField()
  async tasks(@Parent() level: Level): Promise<Task[]> {
    return this.taskService.findForLevel(level.id);
  }

  @ResolveField(() => Submission, { nullable: true, description: "The last submission of the current user for this level" })
  lastSubmission(@Parent() level: Level, @SessionToken() sessionToken: SessionTokenInterface): Promise<Submission> {
    return this.submissionService.findLastForUserAndLevel(sessionToken.userId, level.id);
  }
}
