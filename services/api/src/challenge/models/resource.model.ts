import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Resource {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  link: string;
}
