import { createMock } from "@golevelup/ts-jest";
import { QuizLevelFactory } from "@tests/support/factories/models/quiz-level.factory";

import { SessionToken } from "@/authentication/interfaces/session-token.interface";
import { AnswerOptionService } from "@/challenge/answer-option.service";
import { LevelStatus } from "@/challenge/enums/level-status.enum";
import { LevelService } from "@/challenge/level.service";
import { QuizLevelResolver } from "@/challenge/quiz-level.resolver";

function createQuizLevelResolver(
  partials: {
    levelService?: Partial<LevelService>;
    answerOptionService?: Partial<AnswerOptionService>;
  } = {},
): QuizLevelResolver {
  const levelService = createMock<LevelService>(partials.levelService);
  const answerOptionService = createMock<AnswerOptionService>(partials.answerOptionService);

  return new QuizLevelResolver(answerOptionService, levelService);
}

describe("quiz level resolver", () => {
  const level = QuizLevelFactory.build();
  const sessionToken: SessionToken = { userId: "userid" };
  it("returns answer options for the level", async () => {
    const findForQuizLevel = jest.fn().mockResolvedValue([]);

    const resolver = createQuizLevelResolver({ answerOptionService: { findForQuizLevel } });
    const resolvedAnswerOptions = await resolver.answerOptions(level);

    expect(resolvedAnswerOptions).toBeDefined();
    expect(findForQuizLevel).toHaveBeenCalledWith(level.id);
  });

  it("resolves out the status of a level", async () => {
    const findStatusForQuizLevel = jest.fn().mockResolvedValue(LevelStatus.OPEN);

    const resolver = createQuizLevelResolver({ levelService: { findStatusForQuizLevel } });
    const status = await resolver.status(level, sessionToken);

    expect(status).toBe(LevelStatus.OPEN);
    expect(findStatusForQuizLevel).toHaveBeenCalledWith(level.id, sessionToken.userId);
  });
});
