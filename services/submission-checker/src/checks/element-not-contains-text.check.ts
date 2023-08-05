import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WebDriver } from "selenium-webdriver";

import { ElementContainsText } from "@/checks/element-contains-text.check";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { SeleniumCheck } from "./selenium-check";

@Injectable()
export class ElementNotContainsText extends SeleniumCheck {
  constructor(
    logger: Logger,
    config: ConfigService,
    private readonly elementContainsText: ElementContainsText,
  ) {
    super(logger, config);
  }

  public async evaluateRule(driver: WebDriver, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    if (!rule.options?.selector || !rule.options?.text) {
      this.logger.error(
        `Executing check ${rule.key} on submission ${submission.id} failed due to missing selector or text configuration`,
        null,
        ElementNotContainsText.name,
      );

      return {
        id: rule.id,
        status: "error",
      };
    }

    const containsText = await this.elementContainsText.containsText(driver, rule.options as { selector: string; text: string });

    return {
      id: rule.id,
      status: !containsText ? "success" : "failed",
    };
  }
}
