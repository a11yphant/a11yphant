import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxeResults } from "axe-core";
import { WebDriver } from "selenium-webdriver";

import { AxeFactory } from "../axe.factory";
import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { Check } from "./check.interface";

const CHECK_NAME = "link-name";

@Injectable()
export class AxeLinkNameCheck implements Check {
  constructor(private logger: Logger, private config: ConfigService, private axeFactory: AxeFactory) {}

  public async run(submission: Submission, rule: Rule, driver: WebDriver): Promise<RuleCheckResult> {
    const url = `${this.config.get<string>("submission-checker.renderer-base-url")}${submission.id}`;

    try {
      await driver.get(url);

      const axe = this.axeFactory.create(driver, { runOnly: [CHECK_NAME] });
      const result = await axe.analyze();

      return {
        id: rule.id,
        status: this.isSuccessful(result) ? "success" : "failed",
      };
    } catch (error) {
      this.logger.error(`Executing check ${rule.key} on submission ${submission.id} failed: ${error.message}`, error.stack, AxeLinkNameCheck.name);

      return {
        id: rule.id,
        status: "error",
      };
    }
  }

  private isSuccessful(result: AxeResults): boolean {
    return !!result.passes.find((rule) => rule.id === CHECK_NAME);
  }
}
