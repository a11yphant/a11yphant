import { Field, ObjectType } from "@nestjs/graphql";

import { CodeLevelSubmission } from "../models/code-level-submission.model";

@ObjectType()
export class CreateCodeLevelSubmissionResult {
  @Field(() => CodeLevelSubmission)
  submission: CodeLevelSubmission;
}
