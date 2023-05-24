import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodeFetch from "node-fetch";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { JsdomCheck } from "./jsdom-check";

@Injectable()
export class ElementNotExists extends JsdomCheck {
  constructor(logger: Logger, config: ConfigService, @Inject("fetch") fetch: typeof nodeFetch) {
    super(logger, config, fetch);
  }

  async evaluateRule(document: HTMLElement, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    if (!rule.options?.selector) {
      this.logger.error(
        `Executing check ${rule.key} on submission ${submission.id} failed due to missing selector configuration`,
        null,
        ElementNotExists.name,
      );

      return {
        id: rule.id,
        status: "error",
      };
    }

    const matchingElements = document.querySelectorAll(rule.options.selector);

    return {
      id: rule.id,
      status: matchingElements.length === 0 ? "success" : "failed",
    };
  }
}
