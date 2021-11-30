import { createMock } from "@golevelup/ts-jest";
import { CodeLevelFactory } from "@tests/support/factories/models/code-level.factory";
import { CodeLevelSubmissionFactory } from "@tests/support/factories/models/code-level-submission.factory";

import { LevelService } from "@/challenge/level.service";
import { CodeLevelSubmission } from "@/submission/graphql/models/code-level-submission.model";
import { SubmissionResolver } from "@/submission/graphql/resolvers/submission.resolver";
import { CodeLevelResultService } from "@/submission/services/code-level-result.service";

function createSubmissionResolver(
  partials: {
    codeLevelResultService?: Partial<CodeLevelResultService>;
    levelService?: Partial<LevelService>;
  } = {},
): SubmissionResolver {
  const codeLevelResultService = createMock<CodeLevelResultService>(partials.codeLevelResultService);
  const levelService = createMock<LevelService>(partials.levelService);

  return new SubmissionResolver(levelService, codeLevelResultService);
}

describe("submission resolver", () => {
  it("can resolve a level", async () => {
    const level = CodeLevelFactory.build();
    const submission = new CodeLevelSubmission({ id: "bla", levelId: "blu", createdAt: new Date(), updatedAt: new Date() });
    const findOne = jest.fn().mockResolvedValue(level);

    const resolver = createSubmissionResolver({ levelService: { findOne } });
    const resolvedLevel = await resolver.level(submission);

    expect(resolvedLevel).toBeTruthy();
    expect(findOne).toHaveBeenCalledWith(submission.levelId);
  });

  it("can find the result for a submission", async () => {
    const submission = CodeLevelSubmissionFactory.build({ id: "uuid" });
    const findOneForSubmission = jest.fn().mockResolvedValue({ id: "uuid" });

    const resolver = createSubmissionResolver({ codeLevelResultService: { findOneForSubmission } });
    const resolvedResult = await resolver.result(submission);

    expect(resolvedResult).toBeTruthy();
    expect(findOneForSubmission).toHaveBeenCalledWith(submission.id);
  });

  it("returns null if the submission does not have a result", async () => {
    const findOneForSubmission = jest.fn().mockResolvedValue(null);
    const submission = CodeLevelSubmissionFactory.build();

    const resolver = createSubmissionResolver({ codeLevelResultService: { findOneForSubmission } });
    const resolvedSubmission = await resolver.result(submission);

    expect(resolvedSubmission).toBeNull();
    expect(findOneForSubmission).toHaveBeenCalledWith(submission.id);
  });
});
