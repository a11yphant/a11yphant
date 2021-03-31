import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxeResults } from "axe-core";

import { BrowserService } from "./browser.service";
import { CheckedRequirement, CheckedRule, CheckResult, Requirement, RuleAssignment } from "./check-result.interface";
import { Submission } from "./submission.interface";

@Injectable()
export class CheckSubmissionService {
  constructor(private config: ConfigService, private browser: BrowserService) {}

  public async check(submission: Submission): Promise<CheckResult> {
    // get axe rules from rules and extract axe checks to perform
    const options = {
      runOnly: submission.level.requirements
        .map((req) => req.ruleAssignments)
        .flat()
        .filter((ra) => ra.rule.provider === "axe")
        .map((ra) => ra.rule.configuration.runOnly)
        .flat(),
    };

    // run axe
    const url = `${this.config.get<string>("submission-checker.renderer-base-url")}${submission.id}`;
    const result = await this.browser.runAxeChecks(url, options);

    // map result of axe checks back into check result
    return this.buildAxeCheckResult(result, submission.level.requirements);
  }

  private buildAxeCheckResult(axeResults: AxeResults, requirements: Requirement[]): CheckResult {
    return {
      checkedRequirements: requirements.map(
        (req): CheckedRequirement => ({
          requirement: req,
          checkedRules: req.ruleAssignments.map((rule): CheckedRule => this.evaluateRule(axeResults, rule)),
        }),
      ),
    };
  }

  private evaluateRule(axeResults: AxeResults, ruleAssignment: RuleAssignment): CheckedRule {
    const filterFunc = (res): boolean => ruleAssignment.rule.configuration.runOnly.includes(res.id);

    const passedAllRules = ruleAssignment.rule.configuration.runOnly.length <= axeResults.passes.filter(filterFunc).length;
    const violatesRules = axeResults.violations.filter(filterFunc).length !== 0;

    const passes = !violatesRules && (ruleAssignment.mustPass ? passedAllRules : true);

    return {
      rule: ruleAssignment.rule,
      passes,
      reason: "",
      description: "",
    };
  }
}
