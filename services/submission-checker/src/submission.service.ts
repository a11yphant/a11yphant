import { Injectable } from "@nestjs/common";

import { Submission } from "./submission.interface";

@Injectable()
export class SubmissionService {
  private store = new Map<string, Submission>();

  find(id: string): Submission {
    return this.store.get(id);
  }
}
