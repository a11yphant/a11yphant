import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodeFetch from "node-fetch";

import { ElementContainsText } from "@/checks/element-contains-text.check";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { JsdomCheck } from "./jsdom-check";

@Injectable()
export class ElementNotContainsText extends JsdomCheck {
  constructor(
    logger: Logger,
    config: ConfigService,
    @Inject("fetch") fetch: typeof nodeFetch,
    private readonly elementContainsText: ElementContainsText,
  ) {
    super(logger, config, fetch);
  }

  public async evaluateRule(document: HTMLElement, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    if (!rule.options?.selector || !rule.options?.text) {
      this.logger.error(
        `Executing check ${rule.key} on submission ${submission.id} failed due to missing selector or text configuration`,
        null,
        ElementNotContainsText.name,
      );

      return {
        id: rule.id,
        status: "error",
      };
    }

    const containsText = this.elementContainsText.containsText(document, rule.options as { selector: string; text: string });

    return {
      id: rule.id,
      status: !containsText ? "success" : "failed",
    };
  }
}
