import { ParseUUIDPipe } from "@nestjs/common";
import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { CodeLevelResultService } from "../../services/code-level-result.service";
import { RequirementResultService } from "../../services/requirement-result.service";
import { RequirementResult } from "../models/requirement-result.model";
import { Result } from "../models/result.model";

@Resolver(() => Result)
export class CodeLevelResultResolver {
  constructor(
    private resultService: CodeLevelResultService,
    private requirementResultService: RequirementResultService,
  ) {}

  @Query(() => Result, { nullable: true })
  async resultForSubmission(@Args("submissionId", new ParseUUIDPipe()) submissionId: string): Promise<Result> {
    return this.resultService.findOneForSubmission(submissionId);
  }

  @ResolveField(() => Int, { description: "The amount of all checked requirements." })
  numberOfCheckedRequirements(@Parent() result: Result): Promise<number> {
    return this.resultService.countNumberOfCheckedRequirements(result.id);
  }

  @ResolveField(() => Int, { description: "The amount of all failed requirements checks." })
  numberOfFailedRequirementChecks(@Parent() result: Result): Promise<number> {
    return this.resultService.countNumberOfFailedRequirementChecks(result.id);
  }

  @ResolveField(() => [RequirementResult])
  async requirements(@Parent() result: Result): Promise<RequirementResult[]> {
    return this.requirementResultService.findManyForResult(result.id);
  }
}
