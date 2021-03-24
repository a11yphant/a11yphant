import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";

import { Check } from "./check.model";

export enum CheckStatus {
  SUCCESS,
  FAIL,
}

registerEnumType(CheckStatus, {
  name: "CheckStatus",
  valuesMap: {
    SUCCESS: {
      description: "The user fulfilled the check/requirement.",
    },
    FAIL: {
      description: "The user failed the check/requirement.",
    },
  },
});

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
