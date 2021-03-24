import { Field, ID, ObjectType } from "@nestjs/graphql";

import { CheckStatus } from "./requirement.model";

@ObjectType()
export class Check {
  constructor(properties: { id: string; title: string; description: string; key: string; result?: CheckStatus }) {
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

  @Field(() => CheckStatus, { nullable: true, description: "The result of an submission check. Only applicable in context of an result." })
  result: CheckStatus;
}
