import { CodeLevelSubmission as Submission } from "../graphql/models/code-level-submission.model";
import { Rule } from "../interfaces/rule.interface";
import { RuleCheckResult } from "../interfaces/rule-check-result.interface";

export interface Check {
  run(submission: Submission, rule: Rule): Promise<RuleCheckResult>;
}
