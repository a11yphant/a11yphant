import { Field, ObjectType } from "@nestjs/graphql";

import { Requirement } from "../../challenge/models/requirement.model";
import { ResultStatus } from "./result-status.enum";
import { Submission } from "./submission.model";

@ObjectType({
  description: "The Result to a submission.",
})
export class Result {
  @Field(() => Submission)
  submission: Submission;

  @Field(() => ResultStatus, {
    description: "The current status of the result.",
  })
  status: ResultStatus;

  @Field(() => [Requirement], {
    description: "The individual requirements with the respective results.",
  })
  requirements: Requirement[];
}
