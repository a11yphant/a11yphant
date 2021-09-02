export interface SubmissionCheckCompletedEvent {
  submissionId: string;
  result: SubmissionCheckResult;
}

interface SubmissionCheckResult {
  ruleCheckResults: RuleCheckResult[];
}

interface RuleCheckResult {
  id: string;
  status: "success" | "failed" | "error";
}
