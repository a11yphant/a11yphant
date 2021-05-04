import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { v4 as uuidv4 } from "uuid";

import { RuleStatus } from "../challenge/enums/rule-status.enum";
import { Check } from "../challenge/models/check.model";
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
      const rules = requirement.rules.map((rule) => {
        // if the resultwish is a success then it's a success,
        // otherwise it has a 70% chance to succeed
        rule.result = resultWish === ResultStatus.SUCCESS ? RuleStatus.SUCCESS : Math.random() < 0.7 ? RuleStatus.SUCCESS : RuleStatus.FAIL;
        return rule;
      });

      // deprecated
      // TODO remove
      requirement.checks = rules.map(
        (rule) =>
          new Check({
            id: rule.id,
            key: rule.key,
            title: rule.title,
            description: rule.shortDescription,
            result: rule.result,
          }),
      );

      // aggregate all rules
      requirement.result = rules.reduce((pre, cur) => pre && cur.result === RuleStatus.SUCCESS, true) ? RuleStatus.SUCCESS : RuleStatus.FAIL;
      return requirement;
    });

    return {
      id: uuidv4(),
      requirements,
      // aggregate all requirements
      status:
        resultWish || requirements.reduce((pre, cur) => pre && cur.result === RuleStatus.SUCCESS, true) ? ResultStatus.SUCCESS : ResultStatus.FAIL,
      submission,
    };
  }

  @ResolveField(() => Int, { description: "The amount of all checked rules." })
  numberOfRules(@Parent() result: Result): number {
    return result.requirements.reduce((pre, cur) => pre + cur.rules.length, 0);
  }

  @ResolveField(() => Int, { description: "The amount of all failed rules." })
  numberOfFailedRules(@Parent() result: Result): number {
    return result.requirements.reduce((pre, cur) => pre + cur.rules.filter((ch) => ch.result !== RuleStatus.SUCCESS).length, 0);
  }

  // deprecated
  // TODO remove
  @ResolveField(() => Int, { deprecationReason: "Renamed to numberOfRules." })
  numberOfChecks(@Parent() result: Result): number {
    return this.numberOfRules(result);
  }

  // deprecated
  // TODO remove
  @ResolveField(() => Int, { deprecationReason: "Renamed to numberOfFailedRules." })
  numberOfFailedChecks(@Parent() result: Result): number {
    return this.numberOfFailedRules(result);
  }
}
