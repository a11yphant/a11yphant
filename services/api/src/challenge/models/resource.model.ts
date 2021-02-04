import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Resource {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { description: "External link to the resource (Blog, Spec, etc.)" })
  link: string;
}
