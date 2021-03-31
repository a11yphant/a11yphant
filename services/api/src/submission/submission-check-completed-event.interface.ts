export interface SubmissionCheckCompleted {
  submissionId: string;
  ruleCheckResults: RuleCheckResult[];
}

interface RuleCheckResult {
  id: string;
  status: "success" | "failed" | "error";
}
