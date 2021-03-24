import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Check } from "./check.model";
import { CheckStatus } from "./check-status.enum";

@ObjectType()
export class Requirement {
  constructor(properties: { id: string; title: string; result?: CheckStatus }) {
    this.id = properties.id;
    this.title = properties.title;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => [Check], { description: "The individual checks this requirement is based on." })
  checks: Check[];

  @Field(() => CheckStatus, { nullable: true, description: "The result of an submission check. Only applicable in context of an result." })
  result: CheckStatus;
}
