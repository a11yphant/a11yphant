import { Requirement } from "./check-result.interface";
import { Submission } from "./submission.model";

export class Level {
  submissions: Submission[];
  requirements: Requirement[];
}
