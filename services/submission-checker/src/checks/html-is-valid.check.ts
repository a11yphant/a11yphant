import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodeFetch from "node-fetch";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { Check } from "./check.interface";

interface ValidationResult {
  messages: { type: "error" | "info" }[];
}

@Injectable()
export class HtmlIsValidCheck implements Check {
  constructor(
    private logger: Logger,
    private config: ConfigService,
    @Inject("fetch") private fetch: typeof nodeFetch,
  ) {}

  public async run(submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    const url = `${this.config.get<string>("submission-checker.renderer-base-url")}${submission.id}`;

    try {
      const renderedSubmission = await this.fetch(url).then((response) => response.text());
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
      this.logger.error(`Executing check ${rule.key} on submission ${submission.id} failed: ${error.message}`, error.stack, HtmlIsValidCheck.name);

      return {
        id: rule.id,
        status: "error",
      };
    }
  }

  private isSuccess(validationResult: ValidationResult): boolean {
    return validationResult.messages.filter((message) => message.type === "error").length === 0;
  }
}
