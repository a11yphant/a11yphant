import { Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JSDOM } from "jsdom";
import nodeFetch from "node-fetch";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { Check } from "./check.interface";

export abstract class JsdomCheck implements Check {
  constructor(
    protected logger: Logger,
    private config: ConfigService,
    @Inject("fetch") private fetch: typeof nodeFetch,
  ) {}

  abstract evaluateRule(window: HTMLElement, submission: Submission, rule: Rule): Promise<RuleCheckResult>;

  public async run(submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    const url = `${this.config.get<string>("submission-checker.renderer-base-url")}${submission.id}`;

    try {
      const response = await this.fetch(url);
      const renderedSubmission = await response.text();

      const { window } = new JSDOM(renderedSubmission);

      return this.evaluateRule(window.document.documentElement, submission, rule);
    } catch (error) {
      this.logger.error(`Executing check ${rule.key} on submission ${submission.id} failed: ${error.message}`, error.stack, JsdomCheck.name);

      return {
        id: rule.id,
        status: "error",
      };
    }
  }
}
