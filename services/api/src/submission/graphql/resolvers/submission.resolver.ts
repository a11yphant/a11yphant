import { Args, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { UserInputError } from "apollo-server-express";

import { SessionToken } from "@/authentication/session-token.decorator";
import { SessionToken as SessionTokenInterface } from "@/authentication/session-token.interface";
import { LevelService } from "@/challenge/level.service";
import { Level } from "@/challenge/models/level.model";

import { SubmissionAlreadyHasCheckResultException } from "../../exceptions/submission-already-has-check-result.exception";
import { SubmissionNotFoundException } from "../../exceptions/submission-not-found.exceptoin";
import { SubmissionService } from "../../services/submission.service";
import { CreateSubmissionInput } from "../inputs/create-submission.input";
import { RequestCheckInput } from "../inputs/request-check.input";
import { UpdateSubmissionInput } from "../inputs/update-submission.input";
import { Submission } from "../models/submission.model";
import { CreateSubmissionResult } from "../results/create-submission.result";
import { RequestCheckResult } from "../results/request-check.result";
import { UpdateSubmissionResult } from "../results/update-submission.result";

@Resolver(() => Submission)
export class SubmissionResolver {
  constructor(private readonly submissionService: SubmissionService, private readonly levelService: LevelService) {}

  @Mutation(() => Submission)
  async submit(
    @Args("submissionInput") submissionInput: CreateSubmissionInput,
    @SessionToken() sessionToken: SessionTokenInterface,
  ): Promise<Submission> {
    const level = await this.levelService.findOne(submissionInput.levelId);

    if (!level) {
      throw new UserInputError(`Level to provided levelId not found: ${submissionInput.levelId}.`);
    }

    return this.submissionService.save({
      ...submissionInput,
      userId: sessionToken.userId,
    });
  }

  @Mutation(() => CreateSubmissionResult)
  async createSubmission(
    @Args("submissionInput") submissionInput: CreateSubmissionInput,
    @SessionToken() sessionToken: SessionTokenInterface,
  ): Promise<CreateSubmissionResult> {
    const submission = await this.submissionService.create({ ...submissionInput, userId: sessionToken.userId });

    return {
      submission,
    };
  }

  @Mutation(() => UpdateSubmissionResult)
  async updateSubmission(
    @Args("submissionInput") submissionInput: UpdateSubmissionInput,
    @SessionToken() sessionToken: SessionTokenInterface,
  ): Promise<UpdateSubmissionResult> {
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
  async requestCheck(@Args("requestCheckInput") requestCheckInput: RequestCheckInput): Promise<RequestCheckResult> {
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

  @ResolveField()
  async level(@Parent() submission: Submission): Promise<Level> {
    return this.levelService.findOne(submission.levelId);
  }
}
