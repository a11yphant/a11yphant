import { Field, ObjectType } from "@nestjs/graphql";

import { Requirement } from "../../challenge/models/requirement.model";
import { RuleStatus } from "../../challenge/models/rule-status.enum";

@ObjectType()
export class RequirementResult extends Requirement {
  constructor(properties: { id: string; title: string; description: string; result: RuleStatus; requirementId: string }) {
    super({ id: properties.id, title: properties.title, description: properties.description });
    this.result = properties.result;
    this.requirementId = properties.requirementId;
  }

  @Field(() => RuleStatus, { description: "The result of an submission check. Only applicable in context of an result." })
  result: RuleStatus;

  requirementId: string;
}
