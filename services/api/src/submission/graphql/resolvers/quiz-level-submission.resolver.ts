import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UserInputError } from "apollo-server-errors";

import { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { SessionToken } from "@/authentication/session-token.decorator";
import { AnswersNotValidException } from "@/submission/exceptions/answers-not-valid.excpetion";
import { LevelNotFoundException } from "@/submission/exceptions/level-not-found.exception";
import { QuizLevelSubmissionService } from "@/submission/services/quiz-level-submission.service";

import { QuizLevelAnswerInput } from "../inputs/quiz-level-answer.input";
import { QuizLevelSubmission } from "../models/quiz-level-submission.model";
import { SubmitQuizLevelAnswerResult } from "../results/submit-quiz-level-answer.result";

@Resolver(() => QuizLevelSubmission)
export class QuizLevelSubmissionResolver {
  constructor(private readonly quizLevelSubmissionService: QuizLevelSubmissionService) {}

  @Mutation(() => SubmitQuizLevelAnswerResult)
  async submitQuizLevelAnswer(
    @Args("input") input: QuizLevelAnswerInput,
    @SessionToken() sessionToken: SessionTokenInterface,
  ): Promise<SubmitQuizLevelAnswerResult> {
    try {
      const submissionId = await this.quizLevelSubmissionService.create(input.levelId, input.answers, sessionToken.userId);
      const result = await this.quizLevelSubmissionService.check(submissionId);

      return {
        result,
      };
    } catch (error) {
      if (error instanceof LevelNotFoundException || error instanceof AnswersNotValidException) {
        throw new UserInputError(error.message);
      }

      throw error;
    }
  }
}
