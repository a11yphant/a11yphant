import { createMock } from "@golevelup/ts-jest";
import { CodeLevelResultFactory } from "@tests/support/factories/models/code-level-result.factory";

import { CodeLevelResultResolver } from "@/submission/graphql/resolvers/code-level-result.resolver";
import { CodeLevelResultService } from "@/submission/services/code-level-result.service";
import { RequirementResultService } from "@/submission/services/requirement-result.service";

function createCodeLevelResultResolver(
  partials: {
    codeLevelResultService?: Partial<CodeLevelResultService>;
    requirementResultService?: Partial<RequirementResultService>;
  } = {},
): CodeLevelResultResolver {
  const codeLevelResultService = createMock<CodeLevelResultService>(partials.codeLevelResultService);
  const requirementResultService = createMock<RequirementResultService>(partials.requirementResultService);

  return new CodeLevelResultResolver(codeLevelResultService, requirementResultService);
}

describe("code level result resolver", () => {
  it("can return the result for a submission", async () => {
    const result = CodeLevelResultFactory.build();
    const findOneForSubmission = jest.fn().mockResolvedValue(result);

    const resolver = createCodeLevelResultResolver({ codeLevelResultService: { findOneForSubmission } });
    const resolvedSubmission = await resolver.resultForSubmission(result.submissionId);

    expect(resolvedSubmission).toBeTruthy();
    expect(findOneForSubmission).toHaveBeenCalledWith(result.submissionId);
  });

  it("returns the requirement check results", async () => {
    const result = CodeLevelResultFactory.build();
    const findManyForResult = jest.fn().mockResolvedValue([]);

    const resolver = createCodeLevelResultResolver({ requirementResultService: { findManyForResult } });
    const resolvedResult = await resolver.requirements(result);

    expect(resolvedResult).toBeTruthy();
    expect(findManyForResult).toHaveBeenCalledWith(result.id);
  });

  it("returns the number of requirements for the result", async () => {
    const result = CodeLevelResultFactory.build();
    const countNumberOfCheckedRequirements = jest.fn().mockResolvedValue(3);

    const resolver = createCodeLevelResultResolver({
      codeLevelResultService: { countNumberOfCheckedRequirements },
    });
    const resolvedResult = await resolver.numberOfCheckedRequirements(result);

    expect(resolvedResult).toBeTruthy();
    expect(countNumberOfCheckedRequirements).toHaveBeenCalledWith(result.id);
  });

  it("returns the number of failed requirement checks for the result", async () => {
    const result = CodeLevelResultFactory.build();
    const countNumberOfFailedRequirementChecks = jest.fn().mockResolvedValue(2);

    const resolver = createCodeLevelResultResolver({
      codeLevelResultService: { countNumberOfFailedRequirementChecks },
    });

    const resolvedNumber = await resolver.numberOfFailedRequirementChecks(result);

    expect(resolvedNumber).toBeTruthy();
    expect(countNumberOfFailedRequirementChecks).toHaveBeenCalledWith(result.id);
  });
});
