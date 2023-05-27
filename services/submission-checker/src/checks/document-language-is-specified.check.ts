import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodeFetch from "node-fetch";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { JsdomCheck } from "./jsdom-check";

@Injectable()
export class DocumentLanguageIsSpecified extends JsdomCheck {
  constructor(logger: Logger, config: ConfigService, @Inject("fetch") fetch: typeof nodeFetch) {
    super(logger, config, fetch);
  }

  public async evaluateRule(document: HTMLElement, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    if (!rule.options?.languages) {
      this.logger.error(
        `Executing check ${rule.key} on submission ${submission.id} failed due to missing language or text configuration`,
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

  public containsText(document: HTMLElement, { selector, text }: { selector: string; text: string }): boolean {
    const matchingElements = document.querySelectorAll(selector);

    let containsText = false;
    // iterate using forEach since NodeList<T> only suports that
    matchingElements.forEach((element) => {
      if (element.textContent?.includes(text)) {
        containsText = true;
      }
    });

    return containsText;
  }
}
