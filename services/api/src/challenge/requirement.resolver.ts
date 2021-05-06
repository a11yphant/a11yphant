import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { Rule } from "../challenge/models/rule.model";
import { RuleService } from "../challenge/rule.service";
import { Requirement } from "./models/requirement.model";

@Resolver(() => Requirement)
export class RequirementResolver {
  constructor(private ruleService: RuleService) {}
  @ResolveField(() => Rule)
  rule(@Parent() requirement: Requirement): Promise<Rule> {
    return this.ruleService.findOneForRequirement(requirement.id);
  }
}
