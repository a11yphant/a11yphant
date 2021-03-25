import { Requirement } from "./check-result.interface";
import { Submission } from "./submission.interface";

export class Level {
  submissions: Submission[];
  requirements: Requirement[];
}
