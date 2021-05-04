import { createMock } from "@golevelup/ts-jest";
import { RequirementResultService } from "src/submission/requirement-result.service";

import { ResultResolver } from "../../src/submission/result.resolver";
import { ResultService } from "../../src/submission/result.service";
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
});
