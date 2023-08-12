import { Injectable, Logger } from "@nestjs/common";

import { CodeLevelSubmission as Submission } from "../../graphql/models/code-level-submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { JsdomCheck } from "./jsdom-check";

@Injectable()
export class ElementNotExists extends JsdomCheck {
  constructor(logger: Logger) {
    super(logger);
  }

  async evaluateRule(document: HTMLElement, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    if (!this.ruleHasOption(rule, "selector")) {
      return this.checkConfigurationError(submission, rule, "selector");
    }

    const matchingElements = document.querySelectorAll(rule.options.selector);

    return {
      id: rule.id,
      status: matchingElements.length === 0 ? "success" : "failed",
    };
  }
}
