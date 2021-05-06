import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { By, WebDriver } from "selenium-webdriver";
import { BrowserService } from "src/browser.service";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { SeleniumCheck } from "./selenium-check";

@Injectable()
export class ElementExists extends SeleniumCheck {
  constructor(logger: Logger, config: ConfigService, browser: BrowserService) {
    super(logger, config, browser);
  }

  public async evaluateRule(driver: WebDriver, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
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

    const matchingElements = await driver.findElements(By.css(rule.options.selector));

    return {
      id: rule.id,
      status: matchingElements.length > 0 ? "success" : "failed",
    };
  }
}
