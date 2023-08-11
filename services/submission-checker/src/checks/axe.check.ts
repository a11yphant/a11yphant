import { Inject, Injectable, Logger, Type } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxeResults } from "axe-core";
import axe from "axe-core";
import nodeFetch from "node-fetch";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { Check } from "./check.interface";
import { JsdomCheck } from "./jsdom-check";

export function AxeCheck(checkName: string): Type<Check> {
  @Injectable()
  class AxeCheckHost extends JsdomCheck {
    constructor(logger: Logger, config: ConfigService, @Inject("fetch") fetch: typeof nodeFetch) {
      super(logger, config, fetch);
    }

    public async evaluateRule(document: HTMLElement, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
      const result = await axe.run(document, { runOnly: [checkName] });

      return {
        id: rule.id,
        status: this.isSuccessful(result) ? "success" : "failed",
      };
    }

    private isSuccessful(result: AxeResults): boolean {
      return !!result.passes.find((rule) => rule.id === checkName);
    }
  }

  return AxeCheckHost;
}
