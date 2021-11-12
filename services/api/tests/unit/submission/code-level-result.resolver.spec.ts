import { createMock } from "@golevelup/ts-jest";
import { CodeLevelResultFactory } from "@tests/support/factories/models/code-level-result.factory";
import { RequirementResultFactory } from "@tests/support/factories/models/requirement-result.factory";

import { CodeLevelResultResolver } from "@/submission/graphql/resolvers/code-level-result.resolver";
import { CodeLevelResultService } from "@/submission/services/code-level-result.service";
import { RequirementResultService } from "@/submission/services/requirement-result.service";

describe("code level result resolver", () => {
  it("can return the result for a submission", async () => {
    const result = CodeLevelResultFactory.build();
    const resolver = new CodeLevelResultResolver(
      createMock<CodeLevelResultService>({ findOneForSubmission: jest.fn().mockResolvedValue(result) }),
      createMock<RequirementResultService>(),
    );

    expect(await resolver.resultForSubmission(result.id)).toBeTruthy();
  });

  it("returns the requirement check results", async () => {
    const result = CodeLevelResultFactory.build();
    const requirementResults = RequirementResultFactory.buildList(3);
    const resolver = new CodeLevelResultResolver(
      createMock<CodeLevelResultService>(),
      createMock<RequirementResultService>({
        findManyForResult: jest.fn().mockResolvedValue(requirementResults),
      }),
    );

    expect(await resolver.requirements(result)).toHaveLength(requirementResults.length);
  });

  it("returns the number of requirements for the result", async () => {
    const result = CodeLevelResultFactory.build();
    const resolver = new CodeLevelResultResolver(
      createMock<CodeLevelResultService>({
        countNumberOfCheckedRequirements: jest.fn().mockResolvedValue(3),
      }),
      createMock<RequirementResultService>(),
    );

    expect(await resolver.numberOfCheckedRequirements(result)).toBe(3);
  });

  it("returns the number of failed requirement checks for the result", async () => {
    const result = CodeLevelResultFactory.build();
    const resolver = new CodeLevelResultResolver(
      createMock<CodeLevelResultService>({
        countNumberOfFailedRequirementChecks: jest.fn().mockResolvedValue(2),
      }),
      createMock<RequirementResultService>(),
    );

    expect(await resolver.numberOfFailedRequirementChecks(result)).toBe(2);
  });
});
