import { createMock } from "@golevelup/ts-jest";
import { RequirementResultService } from "src/submission/requirement-result.service";

import { ResultResolver } from "../../src/submission/result.resolver";
import { ResultService } from "../../src/submission/result.service";
import { RequirementResultFactory } from "../factories/models/requirement-result.factory";
import { ResultFactory } from "../factories/models/result.factory";

describe("result resolver", () => {
  it("can return the result for a submission", async () => {
    const result = ResultFactory.build();
    const resolver = new ResultResolver(
      createMock<ResultService>({ findOneForSubmission: jest.fn().mockResolvedValue(result) }),
      createMock<RequirementResultService>(),
    );

    expect(await resolver.resultForSubmission(result.id)).toBeTruthy();
  });

  it("returns the requirement check results", async () => {
    const result = ResultFactory.build();
    const requirementResults = RequirementResultFactory.buildList(3);
    const resolver = new ResultResolver(
      createMock<ResultService>(),
      createMock<RequirementResultService>({
        findManyForResult: jest.fn().mockResolvedValue(requirementResults),
      }),
    );

    expect(await resolver.requirements(result)).toHaveLength(requirementResults.length);
  });
});
