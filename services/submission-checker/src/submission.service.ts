import { Injectable } from '@nestjs/common';
import { Submission } from './submission.model';

const requirements = [
  {
    ruleAssignments: [
      {
        rule: {
          name: 'The page has a specified language',
          provider: 'axe',
          configuration: { runOnly: ['html-has-lang'] },
        },
        mustPass: true,
      },
    ],
  },
  {
    ruleAssignments: [
      {
        rule: {
          name: 'The page must hava a main landmark',
          provider: 'axe',
          configuration: { runOnly: ['landmark-one-main'] },
        },
        mustPass: false,
      },
    ],
  },
  {
    ruleAssignments: [
      {
        rule: {
          name: 'The page body must mot be hidden',
          provider: 'axe',
          configuration: { runOnly: ['aria-hidden-body'] },
        },
        mustPass: true,
      },
    ],
  },
];

@Injectable()
export class SubmissionService {
  find(id: number): Submission {
    return {
      html: `<h1>This is submissiont ${id}</h1>`,
      css: 'body { color: deepseagreen }',
      javascript: `document.querySelector('h1').style.opacity = 0.5`,
      level: {
        requirements,
        submissions: [],
      },
    };
  }
}
