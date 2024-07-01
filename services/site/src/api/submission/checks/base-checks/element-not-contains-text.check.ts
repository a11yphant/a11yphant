import { Injectable, Logger } from "@nestjs/common";
import { DOMWindow } from "jsdom";

import { CodeLevelSubmission as Submission } from "../../graphql/models/code-level-submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { ElementContainsText } from "./element-contains-text.check";
import { JsdomCheck } from "./jsdom-check";

@Injectable()
export class ElementNotContainsText extends JsdomCheck {
  constructor(
    logger: Logger,
    private readonly elementContainsText: ElementContainsText,
  ) {
    super(logger);
  }

  public async evaluateRule(window: DOMWindow, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    if (!this.ruleHasOption(rule, "selector")) {
      return this.checkConfigurationError(submission, rule, "selector");
    }

    if (!this.ruleHasOption(rule, "text")) {
      return this.checkConfigurationError(submission, rule, "text");
    }

    const containsText = this.elementContainsText.containsText(window.document.documentElement, rule.options as { selector: string; text: string });

    return {
      id: rule.id,
      status: !containsText ? "success" : "failed",
    };
  }
}
