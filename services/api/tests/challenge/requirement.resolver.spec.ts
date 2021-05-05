import { createMock } from "@golevelup/ts-jest";

import { RequirementResolver } from "../../src/challenge/requirement.resolver";
import { RuleService } from "../../src/challenge/rule.service";
import { RequirementFactory } from "../factories/models/requirement.factory";
import { RuleFactory } from "../factories/models/rule.factory";

describe("requirement resolver", () => {
  it("resolves the rule for the requirement", async () => {
    const requirement = RequirementFactory.build();
    const rule = RuleFactory.build();
    const resolver = new RequirementResolver(
      createMock<RuleService>({ findOneForRequirement: jest.fn().mockResolvedValue(rule) }),
    );

    expect(await resolver.rule(requirement));
  });
});
