import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodeFetch from "node-fetch";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { BaseCheck } from "./base.check";

@Injectable()
export class DocumentStartsWithHtml5Doctype extends BaseCheck {
  constructor(logger: Logger, config: ConfigService, @Inject("fetch") fetch: typeof nodeFetch) {
    super(logger, config, fetch);
  }

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
