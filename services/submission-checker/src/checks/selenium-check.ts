import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WebDriver } from "selenium-webdriver";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { Check } from "./check.interface";

export abstract class SeleniumCheck implements Check {
  constructor(
    protected logger: Logger,
    private config: ConfigService,
  ) {}

  abstract evaluateRule(driver: WebDriver, submission: Submission, rule: Rule): Promise<RuleCheckResult>;

  public async run(submission: Submission, rule: Rule, driver: WebDriver): Promise<RuleCheckResult> {
    try {
      const url = `${this.config.get<string>("submission-checker.renderer-base-url")}${submission.id}`;
      await driver.get(url);

      const result = await this.evaluateRule(driver, submission, rule);

      return result;
    } catch (error) {
      this.logger.error(`Executing check ${rule.key} on submission ${submission.id} failed: ${error.message}`, error.stack, SeleniumCheck.name);

      return {
        id: rule.id,
        status: "error",
      };
    }
  }
}
