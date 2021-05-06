import { SubmissionCheckResult } from "./submission-check-result.interface";

export interface SubmissionCheckCompletedEvent {
  submissionId: string;
  result: SubmissionCheckResult;
}
