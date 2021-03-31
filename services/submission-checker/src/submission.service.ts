import { Injectable } from "@nestjs/common";

import { Submission } from "./submission.interface";

const requirements = [
  {
    ruleAssignments: [
      {
        rule: {
          name: "The page has a specified language",
          provider: "axe",
          configuration: { runOnly: ["html-has-lang"] },
        },
        mustPass: true,
      },
    ],
  },
  {
    ruleAssignments: [
      {
        rule: {
          name: "The page must hava a main landmark",
          provider: "axe",
          configuration: { runOnly: ["landmark-one-main"] },
        },
        mustPass: false,
      },
    ],
  },
  {
    ruleAssignments: [
      {
        rule: {
          name: "The page body must mot be hidden",
          provider: "axe",
          configuration: { runOnly: ["aria-hidden-body"] },
        },
        mustPass: true,
      },
    ],
  },
];

const level = {
  requirements,
  submissions: [],
};

@Injectable()
export class SubmissionService {
  private store = new Map<string, Submission>();

  find(id: string): Submission {
    return this.store.get(id);
  }

  create({ id, html, css, javascript }: { id: string; html: string; css: string; javascript: string }): void {
    this.store.set(id, { id, html, css, js: javascript, level });
  }
}
