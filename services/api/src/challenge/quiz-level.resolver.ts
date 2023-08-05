import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { SessionToken } from "@/authentication/session-token.decorator";

import { AnswerOptionService } from "./answer-option.service";
import { LevelStatus } from "./enums/level-status.enum";
import { LevelService } from "./level.service";
import { AnswerOption } from "./models/answer-option.model";
import { QuizLevel } from "./models/quiz-level.model";

@Resolver(QuizLevel)
export class QuizLevelResolver {
  constructor(
    private readonly answerOptionService: AnswerOptionService,
    private readonly levelService: LevelService,
  ) {}

  @ResolveField(() => [AnswerOption], { description: "The answer options for this quiz level" })
  answerOptions(@Parent() level: QuizLevel): Promise<AnswerOption[]> {
    return this.answerOptionService.findForQuizLevel(level.id);
  }

  @ResolveField(() => LevelStatus)
  status(@Parent() level: QuizLevel, @SessionToken() sessionToken: SessionTokenInterface): Promise<LevelStatus> {
    return this.levelService.findStatusForQuizLevel(level.id, sessionToken.userId);
  }
}
