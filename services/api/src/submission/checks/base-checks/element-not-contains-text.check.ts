import { Injectable, Logger } from "@nestjs/common";

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

  public async evaluateRule(document: HTMLElement, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    if (!this.ruleHasOption(rule, "selector")) {
      return this.checkConfigurationError(submission, rule, "selector");
    }

    if (!this.ruleHasOption(rule, "text")) {
      return this.checkConfigurationError(submission, rule, "text");
    }

    const containsText = this.elementContainsText.containsText(document, rule.options as { selector: string; text: string });

    return {
      id: rule.id,
      status: !containsText ? "success" : "failed",
    };
  }
}
