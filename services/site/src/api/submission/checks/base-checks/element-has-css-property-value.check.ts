import { Injectable, Logger } from "@nestjs/common";
import { DOMWindow } from "jsdom";

import { CodeLevelSubmission as Submission } from "../../graphql/models/code-level-submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { JsdomCheck } from "./jsdom-check";

@Injectable()
export class ElementHasCssPropertyValue extends JsdomCheck {
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

    let propertyExists = false;
    matchingElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      if (styles[cssProperty] === cssValue) {
        propertyExists = true;
      }
    });

    return {
      id: rule.id,
      status: propertyExists ? "success" : "failed",
    };
  }
}
