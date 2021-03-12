import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Requirement {
  constructor(properties: { id: string; title: string }) {
    this.id = properties.id;
    this.title = properties.title;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;
}
