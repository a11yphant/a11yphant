import { Injectable, Logger } from "@nestjs/common";
import { DOMWindow } from "jsdom";

import { CodeLevelSubmission as Submission } from "../../graphql/models/code-level-submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { JsdomCheck } from "./jsdom-check";

@Injectable()
export class MarginBetweenElementsGreaterThanOrEqual extends JsdomCheck {
  constructor(logger: Logger) {
    super(logger);
  }

  public async evaluateRule(window: DOMWindow, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    for (const option of ["selector1", "selector2", "value"]) {
      if (!this.ruleHasOption(rule, option)) {
        return this.checkConfigurationError(submission, rule, option);
      }
    }

    const { selector1, selector2, value: cssValue } = rule.options;
    const element1 = window.document.querySelector(selector1);
    const element2 = window.document.querySelector(selector2);

    if (element1 === null || element2 === null) {
      return {
        id: rule.id,
        status: "failed",
      };
    }

    const cssValueFloat = parseFloat(cssValue);
    if (isNaN(cssValueFloat)) {
      return this.checkFailed(new Error("Passed value is not a valid number."), submission, rule);
    }

    const style1 = window.getComputedStyle(element1);
    const style2 = window.getComputedStyle(element2);

    const margin1 = style1.marginRight ? parseFloat(style1.marginRight) : parseFloat(style1.margin);
    const margin2 = style2.marginLeft ? parseFloat(style2.marginLeft) : parseFloat(style2.margin);

    return {
      id: rule.id,
      status: margin1 + margin2 >= cssValueFloat ? "success" : "failed",
    };
  }
}
