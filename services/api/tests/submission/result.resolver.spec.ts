import { createMock } from "@golevelup/ts-jest";

import { ResultResolver } from "@/submission/graphql/resolvers/result.resolver";
import { RequirementResultService } from "@/submission/services/requirement-result.service";
import { ResultService } from "@/submission/services/result.service";

import { CodeLevelResultFactory } from "../factories/models/code-level-result.factory";
import { RequirementResultFactory } from "../factories/models/requirement-result.factory";

describe("result resolver", () => {
  it("can return the result for a submission", async () => {
    const result = CodeLevelResultFactory.build();
    const resolver = new ResultResolver(
      createMock<ResultService>({ findOneForSubmission: jest.fn().mockResolvedValue(result) }),
      createMock<RequirementResultService>(),
    );

    expect(await resolver.resultForSubmission(result.id)).toBeTruthy();
  });

  it("returns the requirement check results", async () => {
    const result = CodeLevelResultFactory.build();
    const requirementResults = RequirementResultFactory.buildList(3);
    const resolver = new ResultResolver(
      createMock<ResultService>(),
      createMock<RequirementResultService>({
        findManyForResult: jest.fn().mockResolvedValue(requirementResults),
      }),
    );

    expect(await resolver.requirements(result)).toHaveLength(requirementResults.length);
  });

  it("returns the number of requirements for the result", async () => {
    const result = CodeLevelResultFactory.build();
    const resolver = new ResultResolver(
      createMock<ResultService>({
        countNumberOfCheckedRequirements: jest.fn().mockResolvedValue(3),
      }),
      createMock<RequirementResultService>(),
    );

    expect(await resolver.numberOfCheckedRequirements(result)).toBe(3);
  });

  it("returns the number of failed requirement checks for the result", async () => {
    const result = CodeLevelResultFactory.build();
    const resolver = new ResultResolver(
      createMock<ResultService>({
        countNumberOfFailedRequirementChecks: jest.fn().mockResolvedValue(2),
      }),
      createMock<RequirementResultService>(),
    );

    expect(await resolver.numberOfFailedRequirementChecks(result)).toBe(2);
  });
});
