import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodeFetch from "node-fetch";

import { Submission } from "../../graphql/models/submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { JsdomCheck } from "./jsdom-check";

@Injectable()
export class DocumentLanguageIsSpecified extends JsdomCheck {
  constructor(logger: Logger, config: ConfigService, @Inject("fetch") fetch: typeof nodeFetch) {
    super(logger, config, fetch);
  }

  public async evaluateRule(document: HTMLElement, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
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
      status: languages.includes(document.lang) ? "success" : "failed",
    };
  }
}
