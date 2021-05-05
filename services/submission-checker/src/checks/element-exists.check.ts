import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { By } from "selenium-webdriver";

import { BrowserService } from "../browser.service";
import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { Check } from "./check.interface";

@Injectable()
export class ElementExists implements Check {
  constructor(private logger: Logger, private config: ConfigService, private browser: BrowserService) {}

  public async run(submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    if (!rule.options?.selector) {
      this.logger.error(
        `Executing check ${rule.key} on submission ${submission.id} due too missing selector configuration`,
        null,
        ElementExists.name,
      );

      return {
        id: rule.id,
        status: "error",
      };
    }

    const url = `${this.config.get<string>("submission-checker.renderer-base-url")}${submission.id}`;

    const driver = await this.browser.startSession();
    try {
      await driver.get(url);
      const matchingElements = await driver.findElements(By.css(rule.options.selector));

      return {
        id: rule.id,
        status: matchingElements.length > 0 ? "success" : "failed",
      };
    } catch (error) {
      this.logger.error(`Executing check ${rule.key} on submission ${submission.id} failed: ${error.message}`, error.stack, ElementExists.name);

      return {
        id: rule.id,
        status: "error",
      };
    } finally {
      await driver.close();
    }
  }
}
