import { Rule } from "./rule.interface";
import { Submission } from "./submission.interface";

export interface SubmissionCreatedEvent {
  submission: Submission;
  rules: Rule[];
}
