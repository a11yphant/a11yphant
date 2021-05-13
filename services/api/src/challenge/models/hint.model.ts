import { Field, ID, ObjectType } from "@nestjs/graphql";
@ObjectType()
export class Hint {
  constructor(properties: { id: string; text: string }) {
    this.id = properties.id;
    this.text = properties.text;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  text: string;
}
