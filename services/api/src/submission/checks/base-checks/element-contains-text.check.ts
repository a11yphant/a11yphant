import { Injectable, Logger } from "@nestjs/common";
import { DOMWindow } from "jsdom";

import { CodeLevelSubmission as Submission } from "../../graphql/models/code-level-submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { JsdomCheck } from "./jsdom-check";

@Injectable()
export class ElementContainsText extends JsdomCheck {
  constructor(logger: Logger) {
    super(logger);
  }

  public async evaluateRule(window: DOMWindow, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    if (!this.ruleHasOption(rule, "selector")) {
      return this.checkConfigurationError(submission, rule, "selector");
    }

    if (!this.ruleHasOption(rule, "text")) {
      return this.checkConfigurationError(submission, rule, "text");
    }

    const containsText = this.containsText(window.document.documentElement, rule.options as { selector: string; text: string });

    return {
      id: rule.id,
      status: containsText ? "success" : "failed",
    };
  }

  public containsText(document: HTMLElement, { selector, text }: { selector: string; text: string }): boolean {
    const matchingElements = document.querySelectorAll(selector);

    let containsText = false;
    // iterate using forEach since NodeList<T> only suports that
    matchingElements.forEach((element) => {
      if (element.textContent?.includes(text)) {
        containsText = true;
      }
    });

    return containsText;
  }
}
