import { Requirement } from "./check-result.interface";
import { Submission } from "./submission.interface";

export interface Level {
  submissions: Submission[];
  requirements: Requirement[];
}
