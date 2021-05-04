import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { RequirementResult } from "./models/requirement-result.model";
import { Result } from "./models/result.model";
import { RequirementResultService } from "./requirement-result.service";
import { ResultService } from "./result.service";

@Resolver(() => Result)
export class ResultResolver {
  constructor(private resultService: ResultService, private requirementResultService: RequirementResultService) {}

  @Query(() => Result)
  async resultForSubmission(@Args("submissionId") submissionId: string): Promise<Result> {
    return this.resultService.findOneForSubmission(submissionId);
  }

  @ResolveField(() => Int, { description: "The amount of all checked rules." })
  numberOfRules(@Parent() result: Result): number {
    return 0;
  }

  @ResolveField(() => Int, { description: "The amount of all failed rules." })
  numberOfFailedRules(@Parent() result: Result): number {
    return 0;
  }

  @ResolveField(() => [RequirementResult])
  async requirements(@Parent() result: Result): Promise<RequirementResult[]> {
    return this.requirementResultService.findManyForResult(result.id);
  }
}
