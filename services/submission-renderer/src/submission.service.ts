import { Injectable } from "@nestjs/common";

import { Submission } from "./submission.model";

@Injectable()
export class SubmissionService {
  find(id: number): Submission {
    return {
      css: `p { color: 'blue'; }`,
      html: `<p>hi ${id}</p>`,
      javascript: `console.log(${id})`,
    };
  }
}
