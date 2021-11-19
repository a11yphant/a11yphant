import { createMock } from "@golevelup/ts-jest";
import { AnswerOptionFactory } from "@tests/support/factories/models/answer-option.factory";
import { QuizLevelFactory } from "@tests/support/factories/models/quiz-level.factory";

import { AnswerOptionService } from "@/challenge/answer-option.service";
import { LevelStatus } from "@/challenge/enums/level-status.enum";
import { LevelService } from "@/challenge/level.service";
import { QuizLevelResolver } from "@/challenge/quiz-level.resolver";

describe("quiz level resolver", () => {
  it("returns answer options for the level", async () => {
    const resolver = new QuizLevelResolver(
      createMock<AnswerOptionService>({
        findForQuizLevel: jest.fn().mockResolvedValue(AnswerOptionFactory.buildList(2)),
      }),
      createMock<LevelService>(),
    );
    const level = QuizLevelFactory.build();

    expect(await resolver.answerOptions(level)).toHaveLength(2);
  });

  it("resolves out the status of a level", async () => {
    const resolver = new QuizLevelResolver(
      createMock<AnswerOptionService>(),
      createMock<LevelService>({
        findStatusForQuizLevel: jest.fn().mockResolvedValue(LevelStatus.OPEN),
      }),
    );
    const status = await resolver.status(QuizLevelFactory.build(), { userId: "userid" });

    expect(status).toBe(LevelStatus.OPEN);
  });
});
