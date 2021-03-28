import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Requirement } from "./requirement.model";
import { RuleStatus } from "./rule-status.enum";

@ObjectType()
export class Rule {
  constructor(properties: { id: string; key: string; title: string; shortDescription: string; additionalDescription?: string; result?: RuleStatus }) {
    this.id = properties.id;
    this.title = properties.title;
    this.shortDescription = properties.shortDescription;
    this.additionalDescription = properties.additionalDescription;
    this.key = properties.key;
    this.result = properties.result;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String, { description: "The internal key to address this check in the backend infrastructure." })
  key: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  shortDescription: string;

  @Field(() => String)
  additionalDescription?: string;

  @Field(() => [Requirement], { description: "All requirements this rule is a part of." })
  requirements: Requirement[];

  @Field(() => RuleStatus, { nullable: true, description: "The result of an submission check. Only applicable in context of an result." })
  result?: RuleStatus;
}
