import { createMock } from "@golevelup/ts-jest";
import { RequirementFactory } from "@tests/support/factories/models/requirement.factory";
import { RuleFactory } from "@tests/support/factories/models/rule.factory";

import { RequirementResolver } from "@/challenge/requirement.resolver";
import { RuleService } from "@/challenge/rule.service";

describe("requirement resolver", () => {
  it("resolves the rule for the requirement", async () => {
    const requirement = RequirementFactory.build();
    const rule = RuleFactory.build();
    const findOneForRequirement = jest.fn().mockResolvedValue(rule);

    const resolver = new RequirementResolver(createMock<RuleService>({ findOneForRequirement }));
    const resolvedRule = await resolver.rule(requirement);

    expect(resolvedRule).toBeTruthy();
    expect(findOneForRequirement).toHaveBeenCalledWith(requirement.id);
  });
});
