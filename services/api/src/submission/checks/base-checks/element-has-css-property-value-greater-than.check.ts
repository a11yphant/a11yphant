import { Injectable, Logger } from "@nestjs/common";
import { DOMWindow } from "jsdom";

import { CodeLevelSubmission as Submission } from "../../graphql/models/code-level-submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { JsdomCheck } from "./jsdom-check";

@Injectable()
export class ElementHasCssPropertyValueGreaterThan extends JsdomCheck {
  constructor(logger: Logger) {
    super(logger);
  }

  public async evaluateRule(window: DOMWindow, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    for (const option of ["selector", "property", "value"]) {
      if (!this.ruleHasOption(rule, option)) {
        return this.checkConfigurationError(submission, rule, option);
      }
    }

    const { selector, property: cssProperty, value: cssValue } = rule.options;
    const matchingElements = window.document.querySelectorAll(selector);

    const cssValueFloat = parseFloat(cssValue);
    if (isNaN(cssValueFloat)) {
      return this.checkFailed(new Error("Passed value is not a valid number."), submission, rule);
    }

    let greaterThan = false;
    matchingElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      if (parseFloat(styles[cssProperty]) > cssValueFloat) {
        greaterThan = true;
      }
    });

    return {
      id: rule.id,
      status: greaterThan ? "success" : "failed",
    };
  }
}
