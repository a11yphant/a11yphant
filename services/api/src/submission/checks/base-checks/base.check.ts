import { Inject, Logger } from "@nestjs/common";
import nodeFetch from "node-fetch";

import { CodeLevelSubmission as Submission } from "../../graphql/models/code-level-submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { Check } from "../check.interface";

export abstract class BaseCheck implements Check {
  constructor(
    protected logger: Logger,
    @Inject("fetch") protected fetch: typeof nodeFetch,
  ) {}

  public abstract run(submission: Submission, rule: Rule): Promise<RuleCheckResult>;

  protected async fetchSubmission(submission: Submission): Promise<string> {
    return submission.html;
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
