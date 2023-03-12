import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { By, WebDriver } from "selenium-webdriver";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { SeleniumCheck } from "./selenium-check";

@Injectable()
export class ElementContainsText extends SeleniumCheck {
  constructor(logger: Logger, config: ConfigService) {
    super(logger, config);
  }

  public async evaluateRule(driver: WebDriver, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    if (!rule.options?.selector || !rule.options?.text) {
      this.logger.error(
        `Executing check ${rule.key} on submission ${submission.id} due too missing selector configuration`,
        null,
        ElementContainsText.name,
      );

      return {
        id: rule.id,
        status: "error",
      };
    }

    const containsText = await this.containsText(driver, rule.options as { selector: string; text: string });

    return {
      id: rule.id,
      status: containsText ? "success" : "failed",
    };
  }

  public async containsText(driver: WebDriver, { selector, text }: { selector: string; text: string }): Promise<boolean> {
    const matchingElements = await driver.findElements(By.css(selector));

    const containsText = await matchingElements.reduce(async (prev, element): Promise<boolean> => {
      const elementText = await element.getText();
      return elementText.includes(text) || (await prev);
    }, Promise.resolve(false));

    return containsText;
  }
}
