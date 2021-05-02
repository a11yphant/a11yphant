import { Injectable } from "@nestjs/common";

import { CheckFactory } from "./check.factory";
import { Rule } from "./rule.interface";
import { RuleCheckResult } from "./rule-check-result.interface";
import { Submission } from "./submission.interface";
import { SubmissionCheckResult } from "./submission-check-result.interface";

@Injectable()
export class CheckSubmissionService {
  constructor(private checkFactory: CheckFactory) {}

  public async check(submission: Submission, rules: Rule[]): Promise<SubmissionCheckResult> {
    const ruleCheckResults: RuleCheckResult[] = [];

    for (const rule of rules) {
      const check = this.checkFactory.get(rule.key);

      if (!check) {
        ruleCheckResults.push({
          id: rule.id,
          status: "error",
        });
        continue;
      }

      const result = await check.run(submission, rule);

      ruleCheckResults.push(result);
    }

    return { ruleCheckResults };
  }
}
