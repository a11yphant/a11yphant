import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { LevelService } from "../challenge/level.service";
import { Submission } from "./models/submission.model";
import { SubmissionService } from "./submission.service";
import { SubmissionInput } from "./SubmissionInput";

@Resolver(() => Submission)
export class SubmissionResolver {
  constructor(private readonly submissionService: SubmissionService, private readonly levelService: LevelService) {}

  @Mutation(() => Submission)
  async submit(@Args("submissionData") submissionInput: SubmissionInput): Promise<Submission> {
    const level = this.levelService.findOne(submissionInput.levelId);

    if (!level) {
      // TODO better error
      throw Error("Level not found.");
    }

    return this.submissionService.save(submissionInput);
  }
}
