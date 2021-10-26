import { Injectable, Logger, Type } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxeResults } from "axe-core";
import { WebDriver } from "selenium-webdriver";

import { AxeFactory } from "@/axe.factory";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { Check } from "./check.interface";

export function AxeCheck(checkName: string): Type<Check> {
  @Injectable()
  class AxeCheckHost implements Check {
    constructor(private logger: Logger, private config: ConfigService, private axeFactory: AxeFactory) {}

    public async run(submission: Submission, rule: Rule, driver: WebDriver): Promise<RuleCheckResult> {
      const url = `${this.config.get<string>("submission-checker.renderer-base-url")}${submission.id}`;

      try {
        await driver.get(url);

        const axe = this.axeFactory.create(driver, { runOnly: [checkName] });
        const result = await axe.analyze();

        return {
          id: rule.id,
          status: this.isSuccessful(result) ? "success" : "failed",
        };
      } catch (error) {
        this.logger.error(`Executing check ${rule.key} on submission ${submission.id} failed: ${error.message}`, error.stack, AxeCheckHost.name);

        return {
          id: rule.id,
          status: "error",
        };
      }
    }

    private isSuccessful(result: AxeResults): boolean {
      return !!result.passes.find((rule) => rule.id === checkName);
    }
  }

  return AxeCheckHost;
}
