import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Check } from "./check.model";
import { Rule } from "./rule.model";
import { RuleStatus } from "./rule-status.enum";

@ObjectType()
export class Requirement {
  constructor(properties: { id: string; title: string; result?: RuleStatus }) {
    this.id = properties.id;
    this.title = properties.title;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => [Check], {
    description: "The individual checks this requirement is based on.",
    deprecationReason: "Renamed to rules.",
  })
  checks: Check[];

  @Field(() => [Rule], {
    description: "The individual rules this requirement is based on.",
  })
  rules: Rule[];

  @Field(() => RuleStatus, { nullable: true, description: "The result of an submission check. Only applicable in context of an result." })
  result: RuleStatus;
}
