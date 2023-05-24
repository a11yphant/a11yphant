import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
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

  public async evaluateRule(document: HTMLElement, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
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

    const containsText = this.containsText(document, rule.options as { selector: string; text: string });

    return {
      id: rule.id,
      status: containsText ? "success" : "failed",
    };
  }

  public containsText(document: HTMLElement, { selector, text }: { selector: string; text: string }): boolean {
    const matchingElements = document.querySelectorAll(selector);

    let containsText = false;
    // iterate using forEach since NodeList<T> only suports that
    matchingElements.forEach((element) => {
      if (element.textContent.includes(text)) {
        containsText = true;
      }
    });

    return containsText;
  }
}
