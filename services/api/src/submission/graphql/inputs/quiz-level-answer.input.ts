import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class QuizLevelAnswerInput {
  @Field(() => ID)
  levelId: string;

  @Field(() => [String], { description: "The IDs of the answers believed to be true." })
  answers: string[];
}
