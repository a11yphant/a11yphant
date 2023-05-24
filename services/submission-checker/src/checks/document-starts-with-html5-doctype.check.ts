import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodeFetch from "node-fetch";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";

@Injectable()
export class DocumentStartsWithHtml5Doctype implements Check {
  constructor(
    private logger: Logger,
    private config: ConfigService,
    @Inject("fetch") private fetch: typeof nodeFetch,
  ) {}

  public async run(submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    try {
      const renderedSubmission = await this.fetchSubmission(submission.id);

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
      return this.checkFailed(error, submission, rule);
    }
  }
}
