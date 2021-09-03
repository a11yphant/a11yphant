import { Field, ObjectType } from "@nestjs/graphql";

import { RequirementStatus } from "@/challenge/enums/requirement-status.enum";
import { Requirement } from "@/challenge/models/requirement.model";

@ObjectType()
export class RequirementResult extends Requirement {
  constructor(properties: { id: string; title: string; description: string; result: RequirementStatus; requirementId: string }) {
    super({ id: properties.id, title: properties.title, description: properties.description });
    this.result = properties.result;
    this.requirementId = properties.requirementId;
  }

  @Field(() => RequirementStatus, { description: "The result of an submission check. Only applicable in context of an result." })
  result: RequirementStatus;

  requirementId: string;
}
