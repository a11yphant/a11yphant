import { Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JSDOM } from "jsdom";
import nodeFetch from "node-fetch";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";

export abstract class JsdomCheck implements Check {
  constructor(
    protected logger: Logger,
    private config: ConfigService,
    @Inject("fetch") private fetch: typeof nodeFetch,
  ) {}

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
