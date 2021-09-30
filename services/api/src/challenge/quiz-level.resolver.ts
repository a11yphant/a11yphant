import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { AnswerOptionService } from "./answer-option.service";
import { AnswerOption } from "./models/answer-option.model";
import { QuizLevel } from "./models/quiz-level.model";

@Resolver(QuizLevel)
export class QuizLevelResolver {
  constructor(private readonly answerOptionService: AnswerOptionService) {}

  @ResolveField(() => [AnswerOption], { description: "The answer options for this quiz level" })
  answerOptions(@Parent() level: QuizLevel): Promise<AnswerOption[]> {
    return this.answerOptionService.findForQuizLevel(level.id);
  }
}
