import { Logger } from "@nestjs/common";
import { JSDOM } from "jsdom";
import { DOMWindow } from "jsdom";

import { defaultLinkStylingCss } from "@/submission/checks/default-css";

import { CodeLevelSubmission as Submission } from "../../graphql/models/code-level-submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { BaseCheck } from "./base.check";

export abstract class JsdomCheck extends BaseCheck {
  constructor(logger: Logger) {
    super(logger);
  }

  abstract evaluateRule(window: DOMWindow, submission: Submission, rule: Rule): Promise<RuleCheckResult>;

  public async run(submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    try {
      const { window } = new JSDOM(submission.html);
      const stylesheet = window.document.createElement("style");
      stylesheet.innerHTML = defaultLinkStylingCss;

      if (submission.css) {
        stylesheet.innerHTML += submission.css;
      }
      const head = window.document.getElementsByTagName("head")[0];
      head.appendChild(stylesheet);

      return this.evaluateRule(window, submission, rule);
    } catch (error) {
      return this.checkFailed(error, submission, rule);
    }
  }
}
