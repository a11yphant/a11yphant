import { Field, HideField, ID, ObjectType } from "@nestjs/graphql";

import { ResultStatus } from "./result-status.enum";

@ObjectType({
  description: "The result for the checks related to a submission.",
})
export class Result {
  constructor(properties: { id: string; submissionId: string; status: ResultStatus }) {
    this.id = properties.id;
    this.submissionId = properties.submissionId;
    this.status = properties.status;
  }

  @Field(() => ID)
  id: string;

  @Field(() => ResultStatus, {
    description: "The current status of the result.",
  })
  status: ResultStatus;

  @HideField()
  submissionId: string;
}
