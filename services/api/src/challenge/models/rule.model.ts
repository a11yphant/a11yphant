import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Requirement } from "./requirement.model";
import { RuleStatus } from "./rule-status.enum";

@ObjectType()
export class Rule {
  constructor(properties: { id: string; key: string; result?: RuleStatus }) {
    this.id = properties.id;
    this.key = properties.key;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String, { description: "The internal key to address this check in the backend infrastructure." })
  key: string;

  @Field(() => [Requirement], { description: "All requirements this rule is a part of." })
  requirements: Requirement[];
}
