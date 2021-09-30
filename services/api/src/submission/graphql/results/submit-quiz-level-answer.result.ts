import { Field, ObjectType } from "@nestjs/graphql";

import { Result } from "../models/result.model";

@ObjectType({ description: "The result of submitting a quiz level answer." })
export class SubmitQuizLevelAnswerResult {
  @Field({ description: "The result of checking the answer." })
  result: Result;
}
