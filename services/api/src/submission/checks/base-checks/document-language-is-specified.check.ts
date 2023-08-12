import { Injectable, Logger } from "@nestjs/common";
import { DOMWindow } from "jsdom";

import { CodeLevelSubmission as Submission } from "../../graphql/models/code-level-submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { JsdomCheck } from "./jsdom-check";

@Injectable()
export class DocumentLanguageIsSpecified extends JsdomCheck {
  constructor(logger: Logger) {
    super(logger);
  }

  public async evaluateRule(window: DOMWindow, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    if (!rule.options?.languages) {
      this.logger.error(
        `Executing check ${rule.key} on submission ${submission.id} failed due to missing language configuration`,
        null,
        this.constructor.name,
      );

      return {
        id: rule.id,
        status: "error",
      };
    }

    const languages = rule.options.languages.split(",");

    return {
      id: rule.id,
      status: languages.includes(window.document.documentElement.lang) ? "success" : "failed",
    };
  }
}
