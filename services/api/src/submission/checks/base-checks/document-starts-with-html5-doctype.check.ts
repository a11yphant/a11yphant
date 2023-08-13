import { Injectable, Logger } from "@nestjs/common";

import { CodeLevelSubmission as Submission } from "../../graphql/models/code-level-submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { BaseCheck } from "./base.check";

@Injectable()
export class DocumentStartsWithHtml5Doctype extends BaseCheck {
  constructor(logger: Logger) {
    super(logger);
  }

  public async run(submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    try {
      const renderedSubmission = await this.fetchSubmission(submission);

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
