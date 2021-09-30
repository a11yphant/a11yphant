import { ObjectType } from "@nestjs/graphql";

import { Submission } from "./submission.model";

@ObjectType({
  description: "The submission to a quiz level.",
  implements: [Submission],
})
export class QuizLevelSubmission {}
