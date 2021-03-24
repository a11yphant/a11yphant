import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";

import { Requirement } from "../../challenge/models/requirement.model";
import { Submission } from "./submission.model";

export enum ResultStatus {
  SUCCESS,
  FAIL,
  PENDING,
  ERROR,
}

registerEnumType(ResultStatus, {
  name: "ResultStatus",
  description: "The possible stati of a submission result.",
  valuesMap: {
    SUCCESS: {
      description: "The user passed the level.",
    },
    FAIL: {
      description: "The user failed the level.",
    },
    PENDING: {
      description: "The submission needs to be checked. The result is not yet available.",
    },
    ERROR: {
      description: "An error ocurred. Please call Luca.",
    },
  },
});

@ObjectType({
  description: "The Result to a submission.",
})
export class Result {
  @Field(() => ID)
  id: string;

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
