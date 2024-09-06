import { createMock } from "@golevelup/ts-jest";
import { RequirementResultFactory } from "@tests/support/factories/models/requirement-result.factory";
import { RuleFactory } from "@tests/support/factories/models/rule.factory";

import { RuleService } from "@/challenge/rule.service";
import { RequirementResultResolver } from "@/submission/graphql/resolvers/requirement-result.resolver";

describe("requirement result resolver", () => {
  it("resolves the rule for the requirement", async () => {
    const requirementResult = RequirementResultFactory.build();
    const findOneForRequirement = jest.fn().mockResolvedValue(RuleFactory.build());

    const resolver = new RequirementResultResolver(createMock<RuleService>({ findOneForRequirement }));
    const resolvedRequirement = await resolver.rule(requirementResult);

    expect(resolvedRequirement).toBeTruthy();
    expect(findOneForRequirement).toHaveBeenCalledWith(requirementResult.requirementId);
  });
});
