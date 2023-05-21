import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DOMWindow } from "jsdom";
import nodeFetch from "node-fetch";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { JsdomCheck } from "./jsdom-check";

@Injectable()
export class ElementContainsText extends JsdomCheck {
  constructor(logger: Logger, config: ConfigService, @Inject("fetch") fetch: typeof nodeFetch) {
    super(logger, config, fetch);
  }

  public async evaluateRule(window: DOMWindow, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    if (!rule.options?.selector || !rule.options?.text) {
      this.logger.error(
        `Executing check ${rule.key} on submission ${submission.id} failed due to missing selector or text configuration`,
        null,
        ElementContainsText.name,
      );

      return {
        id: rule.id,
        status: "error",
      };
    }

    const containsText = this.containsText(window, rule.options as { selector: string; text: string });

    return {
      id: rule.id,
      status: containsText ? "success" : "failed",
    };
  }

  public containsText(window: DOMWindow, { selector, text }: { selector: string; text: string }): boolean {
    const matchingElements = window.document.querySelectorAll(selector);

    const containsText = [...matchingElements].reduce((prev, element): boolean => {
      const elementText = element.textContent;
      return elementText.includes(text) || prev;
    }, false);

    return containsText;
  }
}
