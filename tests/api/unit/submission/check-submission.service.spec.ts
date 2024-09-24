/**
 * @jest-environment node
 */

import { createMock, PartialFuncReturn } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { createRule, createSubmission } from "@tests/support/helpers";

import { CheckFactory } from "@/submission/checks/check.factory";
import { Check } from "@/submission/checks/check.interface";
import { RuleCheckResult } from "@/submission/interfaces/rule-check-result.interface";
import { CheckSubmissionService } from "@/submission/services/check-submission.service";

const factory = ({
  checkFactory = {},
}: {
  checkFactory?: PartialFuncReturn<CheckFactory>;
} = {}): CheckSubmissionService => {
  const checkResult: RuleCheckResult = { id: "1", status: "success" };

  return new CheckSubmissionService(
    createMock<Logger>(),
    createMock<CheckFactory>({
      get: jest.fn().mockReturnValue(createMock<Check>({ run: jest.fn().mockResolvedValue(checkResult) })),
      ...checkFactory,
    }),
  );
};

describe("check submission service", () => {
  it("can check a submission", async () => {
    const submission = createSubmission();
    const rules = [createRule()];

    const service = factory();
    const result = await service.check(submission, rules);
    expect(result).toBeTruthy();
  });

  it("returns a formatted test result", async () => {
    const submission = createSubmission();
    const rules = [createRule()];

    const service = factory();
    const result = await service.check(submission, rules);

    expect(result.ruleCheckResults.length).toEqual(1);
    expect(result.ruleCheckResults[0].id).toBeTruthy();
    expect(result.ruleCheckResults[0].status).toBeTruthy();
  });

  it("executes the check", async () => {
    const submission = createSubmission();
    const rules = [createRule()];

    const checkResult: RuleCheckResult = { id: "1", status: "success" };
    const dummyCheck = createMock<Check>({ run: jest.fn().mockResolvedValue(checkResult) });
    const service = factory({ checkFactory: { get: jest.fn().mockReturnValue(dummyCheck) } });

    await service.check(submission, rules);

    expect(dummyCheck.run).toHaveBeenCalled();
  });

  it("adds an error to the result if the check for a rule was not found", async () => {
    const submission = createSubmission();
    const rules = [createRule()];

    const service = factory({ checkFactory: { get: jest.fn().mockReturnValue(null) } });

    const result = await service.check(submission, rules);

    expect(result.ruleCheckResults[0].status).toBe("error");
  });
});
