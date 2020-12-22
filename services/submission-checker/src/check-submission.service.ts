import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxeResults } from 'axe-core';
import { BrowserService } from './browser.service';
import {
  CheckResult,
  Requirement,
  CheckedRequirement,
  CheckedRule,
  RuleAssignment,
} from './check-result.interface';
import { SubmissionService } from './submission.service';

@Injectable()
export class CheckSubmissionService {
  constructor(
    private config: ConfigService,
    private submissionService: SubmissionService,
    private browser: BrowserService,
  ) {}

  public async check(id: number): Promise<CheckResult> {
    // get rules for level of submission from database
    const submission = this.submissionService.find(id);

    // get axe rules from rules and extract axe checks to perform
    const options = {
      runOnly: submission.requirements
        .map((req) => req.ruleAssignments)
        .flat()
        .filter((ra) => ra.rule.provider === 'axe')
        .map((ra) => ra.rule.configuration.runOnly)
        .flat(),
    };

    // run axe
    const url = `${this.config.get<string>('submissionRenderer.baseUrl')}${id}`;
    const result = await this.browser.runAxeChecks(url, options);

    // map result of axe checks back into check result
    return this.buildAxeCheckResult(result, submission.requirements);
  }

  private buildAxeCheckResult(
    axeResults: AxeResults,
    requirements: Requirement[],
  ): CheckResult {
    return {
      checkedRequirements: requirements.map(
        (req): CheckedRequirement => ({
          requirement: req,
          checkedRules: req.ruleAssignments.map(
            (rule): CheckedRule => this.evaluateRule(axeResults, rule),
          ),
        }),
      ),
    };
  }

  private evaluateRule(
    axeResults: AxeResults,
    ruleAssignment: RuleAssignment,
  ): CheckedRule {
    const filterFunc = (res) =>
      ruleAssignment.rule.configuration.runOnly.includes(res.id);

    const passedAllRules =
      ruleAssignment.rule.configuration.runOnly.length <=
      axeResults.passes.filter(filterFunc).length;
    const violatesRules = axeResults.violations.filter(filterFunc).length !== 0;

    const passes =
      !violatesRules && (ruleAssignment.mustPass ? passedAllRules : true);

    return {
      rule: ruleAssignment.rule,
      passes,
      reason: '',
      description: '',
    };
  }
}
