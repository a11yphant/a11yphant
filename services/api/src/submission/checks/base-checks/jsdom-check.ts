import { Logger } from "@nestjs/common";
import { JSDOM } from "jsdom";

import { Submission } from "../../graphql/models/submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { BaseCheck } from "./base.check";

export abstract class JsdomCheck extends BaseCheck {
  constructor(logger: Logger) {
    super(logger);
  }

  abstract evaluateRule(window: HTMLElement, submission: Submission, rule: Rule): Promise<RuleCheckResult>;

  public async run(submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    try {
      const renderedSubmission = await this.fetchSubmission(submission);

      const { window } = new JSDOM(renderedSubmission);

      return this.evaluateRule(window.document.documentElement, submission, rule);
    } catch (error) {
      return this.checkFailed(error, submission, rule);
    }
  }
}
