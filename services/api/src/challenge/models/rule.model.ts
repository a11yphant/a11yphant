import { Field, ID, ObjectType } from "@nestjs/graphql";

import { RequirementStatus } from "../enums/requirement-status.enum";

@ObjectType()
export class Rule {
  constructor(properties: { id: string; key: string; result?: RequirementStatus }) {
    this.id = properties.id;
    this.key = properties.key;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String, { description: "The internal key to address this check in the backend infrastructure." })
  key: string;
}
