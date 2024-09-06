import { Injectable, Logger } from "@nestjs/common";
import ColorContrastChecker from "color-contrast-checker";
import { ColorTranslator } from "colortranslator";
import { DOMWindow } from "jsdom";

import { CodeLevelSubmission as Submission } from "../../graphql/models/code-level-submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { JsdomCheck } from "./jsdom-check";

@Injectable()
export class ColorContrastGreaterThanOrEqual extends JsdomCheck {
  constructor(logger: Logger) {
    super(logger);
  }

  public async evaluateRule(window: DOMWindow, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    for (const option of ["selector", "minContrastValue", "property1", "property2"]) {
      if (!this.ruleHasOption(rule, option)) {
        return this.checkConfigurationError(submission, rule, option);
      }
    }

    const { selector, minContrastValue, property1: cssProperty1, property2: cssProperty2 } = rule.options;
    const matchingElements = window.document.querySelectorAll(selector);

    let hasSufficientColorContrast = false;
    const ccc = new ColorContrastChecker();
    for (const element of matchingElements) {
      const styles = window.getComputedStyle(element);
      let color1: string, color2: string;
      try {
        color1 = new ColorTranslator(styles[cssProperty1]).HEX;
        color2 = new ColorTranslator(styles[cssProperty2]).HEX;
      } catch (err) {
        // invalid color value (e.g. if no color is set, the background-color of a button equals to "ButtonFace")
        return {
          id: rule.id,
          status: "failed",
        };
      }

      if (ccc.isLevelCustom(color1, color2, Number(minContrastValue))) {
        hasSufficientColorContrast = true;
      }
    }

    return {
      id: rule.id,
      status: hasSufficientColorContrast ? "success" : "failed",
    };
  }
}
