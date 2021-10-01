import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { LevelService } from "@/challenge/level.service";
import { Level } from "@/challenge/models/level.model";

import { ResultService } from "../../services/result.service";
import { Result } from "../models/result.model";
import { Submission } from "../models/submission.model";

@Resolver(() => Submission)
export class SubmissionResolver {
  constructor(private readonly levelService: LevelService, private readonly resultService: ResultService) {}

  @ResolveField(() => Level, {
    description: "The level this submission is for.",
  })
  async level(@Parent() submission: Submission): Promise<Level> {
    return this.levelService.findOne(submission.levelId);
  }

  @ResolveField(() => Result, { nullable: true })
  async result(@Parent() submission: Submission): Promise<Result> {
    return this.resultService.findOneForSubmission(submission.id);
  }
}
