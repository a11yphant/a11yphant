import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { Requirement } from "./models/requirement.model";
import { Rule } from "./models/rule.model";
import { RuleService } from "./rule.service";

@Resolver(() => Requirement)
export class RequirementResolver {
  constructor(private ruleService: RuleService) {}
  @ResolveField(() => Rule, {
    description: "The rule this requirement is based on.",
  })
  rule(@Parent() requirement: Requirement): Promise<Rule> {
    return this.ruleService.findOneForRequirement(requirement.id);
  }
}
