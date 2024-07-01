import { Injectable, Logger } from "@nestjs/common";
import { DOMWindow } from "jsdom";

import { CodeLevelSubmission as Submission } from "../../graphql/models/code-level-submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { JsdomCheck } from "./jsdom-check";

@Injectable()
export class ElementHasMinimumDimension extends JsdomCheck {
  constructor(logger: Logger) {
    super(logger);
  }

  public async evaluateRule(window: DOMWindow, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    for (const option of ["selector", "dimension", "minValue"]) {
      if (!this.ruleHasOption(rule, option)) {
        return this.checkConfigurationError(submission, rule, option);
      }
    }

    if (!["width", "height"].includes(rule.options.dimension)) {
      return this.checkConfigurationError(submission, rule, "dimension");
    }

    const { selector, dimension, minValue } = rule.options;
    const matchingElements = window.document.querySelectorAll(selector);

    const minValueFloat = parseFloat(minValue);
    if (isNaN(minValueFloat)) {
      return this.checkFailed(new Error("Passed value is not a valid number."), submission, rule);
    }

    let greaterThanOrEqual = true;
    const check = dimension === "width" ? this.checkWidth : this.checkHeight;
    matchingElements.forEach((element) => {
      const style = window.getComputedStyle(element);

      if (!check(element, style, minValueFloat)) {
        greaterThanOrEqual = false;
      }
    });

    return {
      id: rule.id,
      status: greaterThanOrEqual ? "success" : "failed",
    };
  }

  private checkWidth(element: Element, style: CSSStyleDeclaration, minValue: number): boolean {
    if (
      parseFloat(style.width) >= minValue ||
      parseFloat(style.minWidth) >= minValue ||
      parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + element.innerHTML.length * 8 >= minValue // number of characters x 8 is approx. the width of the string
    ) {
      return true;
    }

    return false;
  }

  private checkHeight(element: Element, style: CSSStyleDeclaration, minValue: number): boolean {
    if (
      parseFloat(style.height) >= minValue ||
      parseFloat(style.minHeight) >= minValue ||
      parseFloat(style.paddingTop) +
        parseFloat(style.paddingBottom) +
        parseFloat(!isNaN(parseFloat(style.lineHeight)) ? style.lineHeight : style.fontSize.length > 0 ? style.fontSize : "16") >=
        minValue // 16px is usually the default font-size in browsers https://developer.mozilla.org/en-US/docs/Web/CSS/font-size#ems
    ) {
      return true;
    }

    return false;
  }
}
