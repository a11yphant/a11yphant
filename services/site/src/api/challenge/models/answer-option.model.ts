import { Field, HideField, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AnswerOption {
  constructor(properties: { id: string; text: string; correct: boolean }) {
    this.id = properties.id;
    this.text = properties.text;
    this.correct = properties.correct;
  }

  @Field(() => ID, { description: "The id of the answer option." })
  id: string;

  @Field(() => String, { description: "The text for answer option formatted as HTML." })
  text: string;

  @HideField()
  correct: boolean;
}
