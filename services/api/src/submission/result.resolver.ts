import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { v4 as uuidv4 } from "uuid";

import { RuleStatus } from "../challenge/models/rule-status.enum";
import { RequirementService } from "../challenge/requirement.service";
import { Result } from "./models/result.model";
import { ResultStatus } from "./models/result-status.enum";
import { SubmissionService } from "./submission.service";

@Resolver(() => Result)
export class ResultResolver {
  constructor(private readonly submissionService: SubmissionService, private readonly requirementService: RequirementService) {}

  @Query(() => Result)
  async resultForSubmission(
    @Args("submissionId") submissionId: string,
    @Args("resultWish", { nullable: true, type: () => ResultStatus }) resultWish: ResultStatus,
  ): Promise<Result> {
    const submission = await this.submissionService.findOne(submissionId);
    const rawRequirements = await this.requirementService.findForLevel(submission.levelId);

    const requirements = rawRequirements.map((requirement) => {
      requirement.result = RuleStatus.SUCCESS;
      return requirement;
    });

    return {
      id: uuidv4(),
      requirements,
      status:
        resultWish || requirements.reduce((pre, cur) => pre && cur.result === RuleStatus.SUCCESS, true) ? ResultStatus.SUCCESS : ResultStatus.FAIL,
      submission,
    };
  }

  @ResolveField(() => Int, { description: "The amount of all checked rules." })
  numberOfRules(@Parent() result: Result): number {
    return 0;
  }

  @ResolveField(() => Int, { description: "The amount of all failed rules." })
  numberOfFailedRules(@Parent() result: Result): number {
    return 0;
  }
}
