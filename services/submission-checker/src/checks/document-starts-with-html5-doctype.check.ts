import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodeFetch from "node-fetch";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { Check } from "./check.interface";

@Injectable()
export class DocumentStartsWithHtml5Doctype implements Check {
  constructor(
    private logger: Logger,
    private config: ConfigService,
    @Inject("fetch") private fetch: typeof nodeFetch,
  ) {}

  public async run(submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    const url = `${this.config.get<string>("submission-checker.renderer-base-url")}${submission.id}`;

    try {
      const renderedSubmission = await this.fetch(url).then((response) => response.text());

      const isValid = renderedSubmission
        .toLowerCase()
        .replace(/<!--(.*?)-->/, "")
        .trimStart()
        .startsWith("<!doctype html>");

      return {
        id: rule.id,
        status: isValid ? "success" : "failed",
      };
    } catch (error) {
      this.logger.error(
        `Executing check ${rule.key} on submission ${submission.id} failed: ${error.message}`,
        error.stack,
        DocumentStartsWithHtml5Doctype.name,
      );

      return {
        id: rule.id,
        status: "error",
      };
    }
  }
}
