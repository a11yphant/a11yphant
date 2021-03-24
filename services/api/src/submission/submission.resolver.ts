import { Args, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { UserInputError } from "apollo-server-express";

import { LevelService } from "../challenge/level.service";
import { Level } from "../challenge/models/level.model";
import { Submission } from "./models/submission.model";
import { SubmissionService } from "./submission.service";
import { SubmissionInput } from "./SubmissionInput";

@Resolver(() => Submission)
export class SubmissionResolver {
  constructor(private readonly submissionService: SubmissionService, private readonly levelService: LevelService) {}

  @Mutation(() => Submission)
  async submit(@Args("submissionInput") submissionInput: SubmissionInput): Promise<Submission> {
    const level = await this.levelService.findOne(submissionInput.levelId);

    if (!level) {
      throw new UserInputError(`Level to provided levelId not found: ${submissionInput.levelId}.`);
    }

    return this.submissionService.save(submissionInput);
  }

  @ResolveField()
  async level(@Parent() sub: Submission): Promise<Level> {
    return this.levelService.findOne(sub.levelId);
  }
}
