import { createMock } from "@golevelup/ts-jest";
import { RequirementResultFactory } from "@tests/support/factories/models/requirement-result.factory";
import { RuleFactory } from "@tests/support/factories/models/rule.factory";

import { RuleService } from "@/challenge/rule.service";
import { RequirementResultResolver } from "@/submission/graphql/resolvers/requirement-result.resolver";

describe("requirement result resolver", () => {
  it("resolves the rule for the requirement", async () => {
    const requirementResult = RequirementResultFactory.build();
    const rule = RuleFactory.build();
    const resolver = new RequirementResultResolver(createMock<RuleService>({ findOneForRequirement: jest.fn().mockResolvedValue(rule) }));

    expect(await resolver.rule(requirementResult)).toHaveProperty("id", rule.id);
  });
});
