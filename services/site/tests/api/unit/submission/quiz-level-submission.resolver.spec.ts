import { faker } from "@faker-js/faker";
import { createMock } from "@golevelup/ts-jest";
import { GraphQLError } from "graphql";

import { ReferenceNotValidException } from "@/submission/exceptions/reference-not-valid.excpetion";
import { QuizLevelSubmissionResolver } from "@/submission/graphql/resolvers/quiz-level-submission.resolver";
import { QuizLevelSubmissionService } from "@/submission/services/quiz-level-submission.service";

describe("quiz level submission resolver", () => {
  it("can submit an answer for a quiz level", async () => {
    const resolver = new QuizLevelSubmissionResolver(createMock<QuizLevelSubmissionService>());

    const result = await resolver.submitQuizLevelAnswer(
      {
        levelId: faker.string.uuid(),
        answers: [faker.string.uuid(), faker.string.uuid()],
      },
      { userId: faker.string.uuid() },
    );

    expect(result).toBeTruthy();
    expect(result.result).toBeTruthy();
    expect(result.result.id).toBeTruthy();
    expect(result.result.status).toBeTruthy();
  });

  it("can handle submission creation errors", async () => {
    const resolver = new QuizLevelSubmissionResolver(
      createMock<QuizLevelSubmissionService>({
        create: jest.fn().mockRejectedValue(new ReferenceNotValidException()),
      }),
    );

    await expect(() =>
      resolver.submitQuizLevelAnswer(
        {
          levelId: faker.string.uuid(),
          answers: [faker.string.uuid(), faker.string.uuid()],
        },
        { userId: faker.string.uuid() },
      ),
    ).rejects.toThrowError(GraphQLError);
  });
});
