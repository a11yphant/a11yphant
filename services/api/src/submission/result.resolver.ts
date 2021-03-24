import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Check } from "src/challenge/models/check.model";
import { RequirementService } from "src/challenge/requirement.service";
import { v4 as uuidv4 } from "uuid";

import { CheckStatus } from "../challenge/models/check-status.enum";
import { Result } from "./models/result.model";
import { ResultStatus } from "./models/result-status.enum";
import { SubmissionService } from "./submission.service";

@Resolver(() => Result)
export class ResultResolver {
  constructor(private readonly submissionService: SubmissionService, private readonly requirementService: RequirementService) {}

  @Query(() => Result)
  async resultForSubmission(
    @Args("submissionId") submissionId: string,
    @Args("resultWish", { nullable: true, type: () => ResultStatus, defaultValue: ResultStatus.SUCCESS }) resultWish: ResultStatus,
  ): Promise<Result> {
    const submission = await this.submissionService.findOne(submissionId);
    const rawReq = await this.requirementService.findForLevel(submission.levelId);

    const result: Result = {
      id: uuidv4(),
      status: resultWish,
      submission,
      requirements: rawReq.map((req) => {
        req.result = Math.random() > 0.5 ? CheckStatus.FAIL : CheckStatus.SUCCESS;
        req.checks = ["Check 1", "Check 2", "Check 3"].map(
          (title) =>
            new Check({
              id: uuidv4(),
              title,
              description: "I am an single check",
              key: "axe-link-name",
              // to have some consistency, if we determined the requirement to be a
              // success we define all underlying checks as successful, if it failed then its a 50:50
              result: req.result === CheckStatus.SUCCESS ? CheckStatus.SUCCESS : Math.random() > 0.5 ? CheckStatus.FAIL : CheckStatus.SUCCESS,
            }),
        );
        return req;
      }),
    };

    return result;
  }

  @ResolveField()
  checkCount(@Parent() result: Result): number {
    return result.requirements.reduce((pre, cur) => pre + cur.checks.length, 0);
  }

  @ResolveField()
  failedChecks(@Parent() result: Result): number {
    return result.requirements.reduce((pre, cur) => pre + cur.checks.filter((ch) => ch.result !== CheckStatus.SUCCESS).length, 0);
  }
}
