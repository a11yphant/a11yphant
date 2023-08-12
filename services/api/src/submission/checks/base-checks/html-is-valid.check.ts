import { Inject, Injectable, Logger } from "@nestjs/common";
import nodeFetch from "node-fetch";

import { CodeLevelSubmission as Submission } from "../../graphql/models/code-level-submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { BaseCheck } from "./base.check";

interface ValidationResult {
  messages: { type: "error" | "info" }[];
}

@Injectable()
export class HtmlIsValidCheck extends BaseCheck {
  constructor(
    logger: Logger,
    @Inject("fetch") private fetch: typeof nodeFetch,
  ) {
    super(logger);
  }

  public async run(submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    try {
      const renderedSubmission = await this.fetchSubmission(submission);
      const validationResult: ValidationResult = await this.fetch("https://validator.w3.org/nu/?out=json", {
        method: "POST",
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
        },
        body: renderedSubmission,
      }).then((response) => response.json());

      return {
        id: rule.id,
        status: this.isSuccess(validationResult) ? "success" : "failed",
      };
    } catch (error) {
      return this.checkFailed(error, submission, rule);
    }
  }

  private isSuccess(validationResult: ValidationResult): boolean {
    return validationResult.messages.filter((message) => message.type === "error").length === 0;
  }
}
