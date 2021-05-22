import { createMock } from "@golevelup/ts-jest";

import { RuleService } from "../../src/challenge/rule.service";
import { RequirementResultResolver } from "../../src/submission/requirement-result.resolver";
import { RequirementResultFactory } from "../factories/models/requirement-result.factory";
import { RuleFactory } from "../factories/models/rule.factory";

describe("requirement result resolver", () => {
  it("resolves the rule for the requirement", async () => {
    const requirementResult = RequirementResultFactory.build();
    const rule = RuleFactory.build();
    const resolver = new RequirementResultResolver(createMock<RuleService>({ findOneForRequirement: jest.fn().mockResolvedValue(rule) }));

    expect(await resolver.rule(requirementResult)).toHaveProperty("id", rule.id);
  });
});
