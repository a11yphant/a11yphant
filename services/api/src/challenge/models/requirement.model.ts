import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Requirement {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;
}
