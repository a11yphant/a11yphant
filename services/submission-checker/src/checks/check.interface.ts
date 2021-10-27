import { WebDriver } from "selenium-webdriver";
import { Rule } from "src/rule.interface";
import { RuleCheckResult } from "src/rule-check-result.interface";
import { Submission } from "src/submission.interface";

export interface Check {
  run(submission: Submission, rule: Rule, webdriver: WebDriver): Promise<RuleCheckResult>;
}
