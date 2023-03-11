import { Field, HideField, ID, ObjectType } from "@nestjs/graphql";

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

  @HideField()
  options: { [key: string]: string };
}
