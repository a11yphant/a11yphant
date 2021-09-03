import { Field, ObjectType } from "@nestjs/graphql";

import { Submission } from "./models/submission.model";

@ObjectType()
export class UpdateSubmissionResult {
  @Field(() => Submission)
  submission: Submission;
}
