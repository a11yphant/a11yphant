import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

import { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { SessionToken } from "@/authentication/session-token.decorator";

import { SubmissionAlreadyHasCheckResultException } from "../../exceptions/submission-already-has-check-result.exception";
import { SubmissionNotFoundException } from "../../exceptions/submission-not-found.exception";
import { CodeLevelSubmissionService } from "../../services/code-level-submission.service";
import { CreateCodeLevelSubmissionInput } from "../inputs/create-code-level-submission.input";
import { RequestCodeLevelCheckInput } from "../inputs/request-code-level-check.input";
import { UpdateCodeLevelSubmissionInput } from "../inputs/update-code-level-submission.input";
import { CodeLevelSubmission } from "../models/code-level-submission.model";
import { CreateCodeLevelSubmissionResult } from "../results/create-code-level-submission.result";
import { RequestCheckResult } from "../results/request-check.result";
import { UpdateCodeLevelSubmissionResult } from "../results/update-code-level-submission.result";

@Resolver(() => CodeLevelSubmission)
export class CodeLevelSubmissionResolver {
  constructor(private readonly submissionService: CodeLevelSubmissionService) {}

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
        throw new GraphQLError(`Submission with id ${submissionInput.id} not found.`, { extensions: { code: "BAD_USER_INPUT" } });
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
        throw new GraphQLError("A check for this submission has already been requested", { extensions: { code: "BAD_USER_INPUT" } });
      }

      throw error;
    }
  }
}
