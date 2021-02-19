import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Hint {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  content: string;
}
