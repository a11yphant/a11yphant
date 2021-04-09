import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxeResults } from "axe-core";

import { BrowserService } from "../browser.service";
import { Rule } from "../rule.interface";
import { RuleCheckResult } from "../rule-check-result.interface";
import { Submission } from "../submission.interface";
import { Check } from "./check.interface";

const CHECK_NAME = "link-name";

@Injectable()
export class AxeLinkNameCheck implements Check {
  constructor(private logger: Logger, private config: ConfigService, private browser: BrowserService) {}

  public async run(submission: Submission, rule: Rule): Promise<RuleCheckResult> {
    const url = `${this.config.get<string>("submission-checker.renderer-base-url")}${submission.id}`;

    let result: AxeResults;
    try {
      result = await this.browser.runAxeChecks(url, {
        runOnly: [CHECK_NAME],
      });
    } catch (error) {
      this.logger.error(`Executing check ${rule.key} on submission ${submission.id} failed: ${error.message}`, AxeLinkNameCheck.name);

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
    return !!result.passes.find((rule) => rule.id === CHECK_NAME);
  }
}
