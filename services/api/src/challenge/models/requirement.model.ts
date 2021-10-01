import { Field, ID, ObjectType } from "@nestjs/graphql";

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

  options: { [key: string]: string };
}
