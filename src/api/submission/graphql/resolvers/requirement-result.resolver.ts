import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { Rule } from "@/challenge/models/rule.model";
import { RuleService } from "@/challenge/rule.service";

import { RequirementResult } from "../models/requirement-result.model";

@Resolver(() => RequirementResult)
export class RequirementResultResolver {
  constructor(private ruleService: RuleService) {}
  @ResolveField(() => Rule)
  rule(@Parent() requirementResult: RequirementResult): Promise<Rule> {
    return this.ruleService.findOneForRequirement(requirementResult.requirementId);
  }
}
