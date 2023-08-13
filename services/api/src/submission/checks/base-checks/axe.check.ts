import { Injectable, Logger, Type } from "@nestjs/common";
import { AxeResults } from "axe-core";
import axe from "axe-core";
import { DOMWindow } from "jsdom";

import { CodeLevelSubmission as Submission } from "../../graphql/models/code-level-submission.model";
import { Rule } from "../../interfaces/rule.interface";
import { RuleCheckResult } from "../../interfaces/rule-check-result.interface";
import { Check } from "../check.interface";
import { JsdomCheck } from "./jsdom-check";

export function AxeCheck(checkName: string): Type<Check> {
  @Injectable()
  class AxeCheckHost extends JsdomCheck {
    constructor(logger: Logger) {
      super(logger);
    }

    public async evaluateRule(window: DOMWindow, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
      const result = await axe.run(window.document.documentElement, { runOnly: [checkName] });

      console.log("result ", result);

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
