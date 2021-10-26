import { Injectable, Logger, Type } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxeResults } from "axe-core";

import { BrowserService } from "../browser.service";
import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { Check } from "./check.interface";

export function AxeCheck(checkName: string): Type<Check> {
  @Injectable()
  class AxeCheckHost implements Check {
    constructor(private readonly logger: Logger, private readonly config: ConfigService, private browser: BrowserService) {}

    public async run(submission: Submission, rule: Rule): Promise<RuleCheckResult> {
      const url = `${this.config.get<string>("submission-checker.renderer-base-url")}${submission.id}`;

      let result: AxeResults;
      try {
        result = await this.browser.runAxeChecks(url, {
          runOnly: [checkName],
        });
      } catch (error) {
        this.logger.error(`Executing check ${rule.key} on submission ${submission.id} failed: ${error.message}`, error.stack, AxeCheckHost.name);

        return {
          id: rule.id,
          status: "error",
        };
      }

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
