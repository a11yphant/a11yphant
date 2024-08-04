import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import type { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { SessionToken } from "@/authentication/session-token.decorator";
import { CodeLevelSubmission } from "@/submission/graphql/models/code-level-submission.model";
import { CodeLevelSubmissionService } from "@/submission/services/code-level-submission.service";

import { LevelStatus } from "./enums/level-status.enum";
import { LevelService } from "./level.service";
import { CodeLevel } from "./models/code-level.model";
import { Requirement } from "./models/requirement.model";
import { Task } from "./models/task.model";
import { RequirementService } from "./requirement.service";
import { TaskService } from "./task.service";

@Resolver(() => CodeLevel)
export class CodeLevelResolver {
  constructor(
    private requirementService: RequirementService,
    private taskService: TaskService,
    private submissionService: CodeLevelSubmissionService,
    private levelService: LevelService,
  ) {}
  @ResolveField(() => [Requirement], {
    description: "The requirements for this level",
  })
  async requirements(@Parent() level: CodeLevel): Promise<Requirement[]> {
    return this.requirementService.findForLevel(level.id);
  }

  @ResolveField(() => [Task], {
    description: "The tasks that need to be solved for this level.",
  })
  async tasks(@Parent() level: CodeLevel): Promise<Task[]> {
    return this.taskService.findForLevel(level.id);
  }

  @ResolveField(() => CodeLevelSubmission, { nullable: true, description: "The last submission of the current user for this level" })
  lastSubmission(@Parent() level: CodeLevel, @SessionToken() sessionToken: SessionTokenInterface): Promise<CodeLevelSubmission> {
    return this.submissionService.findLastForUserAndLevel(sessionToken.userId, level.id);
  }

  @ResolveField(() => LevelStatus)
  status(@Parent() level: CodeLevel, @SessionToken() sessionToken: SessionTokenInterface): Promise<LevelStatus> {
    return this.levelService.findStatusForCodeLevel(level.id, sessionToken.userId);
  }
}
