import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class HelloWorld {
  @Field(() => ID)
  id: string;
  message: string;
}
