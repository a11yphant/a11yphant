import { createMock } from "@golevelup/ts-jest";
import { AnswerOptionFactory } from "@tests/factories/models/answer-option.factory";
import { QuizLevelFactory } from "@tests/factories/models/quiz-level.factory";

import { AnswerOptionService } from "@/challenge/answer-option.service";
import { QuizLevelResolver } from "@/challenge/quiz-level.resolver";

describe("quiz level resolver", () => {
  it("returns answer options for the level", async () => {
    const resolver = new QuizLevelResolver(
      createMock<AnswerOptionService>({
        findForQuizLevel: jest.fn().mockResolvedValue(AnswerOptionFactory.buildList(2)),
      }),
    );
    const level = QuizLevelFactory.build();

    expect(await resolver.answerOptions(level)).toHaveLength(2);
  });
});
