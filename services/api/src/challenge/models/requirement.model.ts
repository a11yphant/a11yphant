import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Rule } from "./rule.model";

@ObjectType()
export class Requirement {
  constructor(properties: { id: string; title: string; description: string }) {
    this.id = properties.id;
    this.title = properties.title;
    this.description = properties.description;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Rule, {
    description: "The rule this requirement is based on.",
  })
  rule: Rule;
}
