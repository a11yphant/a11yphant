import { Injectable, Logger, Type } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxeResults } from "axe-core";
import { WebDriver } from "selenium-webdriver";

import { AxeFactory } from "@/axe.factory";

import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { Check } from "./check.interface";
import { SeleniumCheck } from "./selenium-check";

export function AxeCheck(checkName: string): Type<Check> {
  @Injectable()
  class AxeCheckHost extends SeleniumCheck {
    constructor(
      logger: Logger,
      config: ConfigService,
      private axeFactory: AxeFactory,
    ) {
      super(logger, config);
    }

    async evaluateRule(driver: WebDriver, submission: Submission, rule: Rule): Promise<RuleCheckResult> {
      const axe = this.axeFactory.create(driver, { runOnly: [checkName] });
      const result = await axe.analyze();

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
