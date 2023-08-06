import { Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JSDOM } from "jsdom";
import nodeFetch from "node-fetch";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { BaseCheck } from "./base.check";

export abstract class JsdomCheck extends BaseCheck {
  constructor(logger: Logger, config: ConfigService, @Inject("fetch") fetch: typeof nodeFetch) {
    super(logger, config, fetch);
  }

  abstract evaluateRule(window: HTMLElement, submission: Submission, rule: Rule): Promise<RuleCheckResult>;

  public async run(submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    try {
      const renderedSubmission = await this.fetchSubmission(submission.id);

      const { window } = new JSDOM(renderedSubmission);

      return this.evaluateRule(window.document.documentElement, submission, rule);
    } catch (error) {
      return this.checkFailed(error, submission, rule);
    }
  }
}
