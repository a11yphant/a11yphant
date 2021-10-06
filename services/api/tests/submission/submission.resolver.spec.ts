import { createMock } from "@golevelup/ts-jest";
import { CodeLevelFactory } from "@tests/factories/models/code-level.factory";
import { CodeLevelSubmissionFactory } from "@tests/factories/models/code-level-submission.factory";

import { LevelService } from "@/challenge/level.service";
import { CodeLevelSubmission } from "@/submission/graphql/models/code-level-submission.model";
import { SubmissionResolver } from "@/submission/graphql/resolvers/submission.resolver";
import { CodeLevelResultService } from "@/submission/services/code-level-result.service";

describe("submission resolver", () => {
  it("can resolve a level", async () => {
    const mockLevel = CodeLevelFactory.build();

    const resolver = new SubmissionResolver(
      createMock<LevelService>({
        findOne: jest.fn().mockResolvedValue(mockLevel),
      }),
      createMock<CodeLevelResultService>(),
    );

    const level = await resolver.level(new CodeLevelSubmission({ id: "bla", levelId: "blu", createdAt: new Date(), updatedAt: new Date() }));

    expect(level).toBeTruthy();
    expect(level.id).toBe(mockLevel.id);
  });

  it("can find the result for a submission", async () => {
    const resolver = new SubmissionResolver(
      createMock<LevelService>(),
      createMock<CodeLevelResultService>({
        findOneForSubmission: jest.fn().mockResolvedValue({ id: "uuid" }),
      }),
    );

    const submission = await resolver.result(CodeLevelSubmissionFactory.build({ id: "uuid" }));

    expect(submission).toBeTruthy();
    expect(submission).toHaveProperty("id", "uuid");
  });

  it("returns null if the submission does not have a result", async () => {
    const resolver = new SubmissionResolver(
      createMock<LevelService>(),
      createMock<CodeLevelResultService>({
        findOneForSubmission: jest.fn().mockResolvedValue(null),
      }),
    );

    const submission = await resolver.result(CodeLevelSubmissionFactory.build({ id: "uuid" }));

    expect(submission).toBeNull();
  });
});
