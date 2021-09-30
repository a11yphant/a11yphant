import { Args, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { UserInputError } from "apollo-server-express";

import { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { SessionToken } from "@/authentication/session-token.decorator";
import { LevelService } from "@/challenge/level.service";
import { Level } from "@/challenge/models/level.model";

import { SubmissionAlreadyHasCheckResultException } from "../../exceptions/submission-already-has-check-result.exception";
import { SubmissionNotFoundException } from "../../exceptions/submission-not-found.exception";
import { ResultService } from "../../services/result.service";
import { SubmissionService } from "../../services/submission.service";
import { CreateCodeLevelSubmissionInput } from "../inputs/create-code-level-submission.input";
import { RequestCodeLevelCheckInput } from "../inputs/request-code-level-check.input";
import { UpdateCodeLevelSubmissionInput } from "../inputs/update-code-level-submission.input";
import { CodeLevelSubmission } from "../models/code-level-submission.model";
import { Result } from "../models/result.model";
import { CreateCodeLevelSubmissionResult } from "../results/create-code-level-submission.result";
import { RequestCheckResult } from "../results/request-check.result";
import { UpdateCodeLevelSubmissionResult } from "../results/update-code-level-submission.result";

@Resolver(() => CodeLevelSubmission)
export class SubmissionResolver {
  constructor(
    private readonly submissionService: SubmissionService,
    private readonly levelService: LevelService,
    private readonly resultService: ResultService,
  ) {}

  @Mutation(() => CreateCodeLevelSubmissionResult)
  async createCodeLevelSubmission(
    @Args("submissionInput") submissionInput: CreateCodeLevelSubmissionInput,
    @SessionToken() sessionToken: SessionTokenInterface,
  ): Promise<CreateCodeLevelSubmissionResult> {
    const submission = await this.submissionService.create({ ...submissionInput, userId: sessionToken.userId });

    return {
      submission,
    };
  }

  @Mutation(() => UpdateCodeLevelSubmissionResult)
  async updateCodeLevelSubmission(
    @Args("submissionInput") submissionInput: UpdateCodeLevelSubmissionInput,
    @SessionToken() sessionToken: SessionTokenInterface,
  ): Promise<UpdateCodeLevelSubmissionResult> {
    let submission;
    try {
      submission = await this.submissionService.update({ ...submissionInput, userId: sessionToken.userId });
    } catch (error) {
      if (error instanceof SubmissionNotFoundException) {
        throw new UserInputError(`Submission with id ${submissionInput.id} not found.`);
      }

      throw error;
    }

    return {
      submission,
    };
  }

  @Mutation(() => RequestCheckResult)
  async requestCodeLevelCheck(@Args("requestCheckInput") requestCheckInput: RequestCodeLevelCheckInput): Promise<RequestCheckResult> {
    try {
      const result = await this.submissionService.requestCheck(requestCheckInput.submissionId);

      return {
        result,
      };
    } catch (error) {
      if (error instanceof SubmissionAlreadyHasCheckResultException) {
        throw new UserInputError("A check for this submission has already been requested");
      }

      throw error;
    }
  }

  @ResolveField(() => Level, {
    description: "The level this submission is for.",
  })
  async level(@Parent() submission: CodeLevelSubmission): Promise<Level> {
    return this.levelService.findOne(submission.levelId);
  }

  @ResolveField(() => Result, { nullable: true })
  async result(@Parent() submission: CodeLevelSubmission): Promise<Result> {
    return this.resultService.findOneForSubmission(submission.id);
  }
}
