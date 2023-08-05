import { Injectable, Logger } from "@nestjs/common";
import { WebDriver } from "selenium-webdriver";

import { CheckFactory } from "./check.factory";
import { Rule } from "./rule.interface";
import { RuleCheckResult } from "./rule-check-result.interface";
import { Submission } from "./submission.interface";
import { SubmissionCheckResult } from "./submission-check-result.interface";

@Injectable()
export class CheckSubmissionService {
  constructor(
    private logger: Logger,
    private checkFactory: CheckFactory,
  ) {}

  public async check(submission: Submission, rules: Rule[], webdriver: WebDriver): Promise<SubmissionCheckResult> {
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

      const result = await check.run(submission, rule, webdriver);

      ruleCheckResults.push(result);
    }

    return { ruleCheckResults };
  }
}
