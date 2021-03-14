import { Field, ID, ObjectType } from "@nestjs/graphql";
@ObjectType()
export class Resource {
  constructor(properties: { id: string; title: string; link: string }) {
    this.id = properties.id;
    this.title = properties.title;
    this.link = properties.link;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { description: "External link to the resource (Blog, Spec, etc.)" })
  link: string;
}
