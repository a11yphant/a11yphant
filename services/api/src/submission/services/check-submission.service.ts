import { Injectable, Logger } from "@nestjs/common";

import { CheckFactory } from "../checks/check.factory";
import { CodeLevelSubmission as Submission } from "../graphql/models/code-level-submission.model";
import { Rule } from "../interfaces/rule.interface";
import { RuleCheckResult } from "../interfaces/rule-check-result.interface";
import { SubmissionCheckResult } from "../interfaces/submission-check-result.interface";

@Injectable()
export class CheckSubmissionService {
  constructor(
    private logger: Logger,
    private checkFactory: CheckFactory,
  ) {}

  public async check(submission: Submission, rules: Rule[]): Promise<SubmissionCheckResult> {
    const ruleCheckResults: RuleCheckResult[] = [];

    for (const rule of rules) {
      this.logger.log(`Checking rule ${rule.key} on submission ${submission.id}`, CheckSubmissionService.name);

      const check = this.checkFactory.get(rule.key);

      if (!check) {
        ruleCheckResults.push({
          id: rule.id,
          status: "error",
        });
        continue;
      }

      const result = await check.run(submission, rule);
      console.log(rule.key);
      console.log(check);
      console.log(result);

      ruleCheckResults.push(result);
    }

    return { ruleCheckResults };
  }
}
