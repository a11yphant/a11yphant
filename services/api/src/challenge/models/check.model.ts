// Kept but marked as deprecated in the API.
// TODO remove when no longer needed.

import { Field, ID, ObjectType } from "@nestjs/graphql";

import { RequirementStatus } from "../enums/requirement-status.enum";

@ObjectType()
export class Check {
  constructor(properties: { id: string; title: string; description: string; key: string; result?: RequirementStatus }) {
    this.id = properties.id;
    this.title = properties.title;
    this.description = properties.description;
    this.key = properties.key;
    this.result = properties.result;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { description: "The internal key to address this check in the backend infrastructure." })
  key: string;

  @Field(() => String)
  description: string;

  @Field(() => RequirementStatus, { nullable: true, description: "The result of an submission check. Only applicable in context of an result." })
  result: RequirementStatus;
}
