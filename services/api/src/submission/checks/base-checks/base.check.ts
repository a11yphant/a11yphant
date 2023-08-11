import { Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodeFetch from "node-fetch";

import { Submission } from "../../graphql/models/submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { Check } from "../check.interface";

export abstract class BaseCheck implements Check {
  constructor(
    protected logger: Logger,
    protected config: ConfigService,
    @Inject("fetch") protected fetch: typeof nodeFetch,
  ) {}

  public abstract run(submission: Submission, rule: Rule): Promise<RuleCheckResult>;

  protected async fetchSubmission(submissionId: string): Promise<string> {
    const url = `${this.config.get<string>("submission-checker.renderer-base-url")}${submissionId}`;
    const response = await this.fetch(url);
    const text = response.text();

    return text;
  }

  protected checkFailed(error: Error, submission: Submission, rule: Rule): RuleCheckResult {
    this.logger.error(`Executing check ${rule.key} on submission ${submission.id} failed: ${error.message}`, error.stack, this.constructor.name);

    return {
      id: rule.id,
      status: "error",
    };
  }

  protected ruleHasOption(rule: Rule, key: string): boolean {
    return !!rule.options?.[key];
  }

  protected checkConfigurationError(submission: Submission, rule: Rule, key: string): RuleCheckResult {
    this.logger.error(
      `Executing check ${rule.key} on submission ${submission.id} failed due to missing ${key} configuration for the rule.`,
      null,
      this.constructor.name,
    );

    return {
      id: rule.id,
      status: "error",
    };
  }
}
