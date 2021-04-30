import { createMock, PartialFuncReturn } from "@golevelup/nestjs-testing";
import { ConfigService } from "@nestjs/config";

import { BrowserService } from "./browser.service";
import { CheckSubmissionService } from "./check-submission.service";
import { Submission } from "./submission.interface";

const axeMockResult = {
  violations: [
    {
      description: "Ensures every HTML document has a lang attribute",
      help: "<html> element must have a lang attribute",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.1/html-has-lang?application=webdriverjs",
      id: "html-has-lang",
      impact: "serious",
      nodes: [
        {
          all: [],
          any: [
            {
              data: {
                messageKey: "noLang",
              },
              id: "has-lang",
              impact: "serious",
              message: "The <html> element does not have a lang attribute",
              relatedNodes: [],
            },
          ],
          failureSummary: "Fix any of the following:\n  The <html> element does not have a lang attribute",
          html:
            "<html><head>\n                    <title>Test</title>\n                </head>\n                <body>\n                    Insert snippet here\n                \n            \n        </body></html>",
          impact: "serious",
          none: [],
          target: ["html"],
        },
      ],
      tags: ["cat.language", "wcag2a", "wcag311", "ACT"],
    },
  ],
  passes: [
    {
      description: "Ensures aria-hidden='true' is not present on the document body.",
      help: "aria-hidden='true' must not be present on the document body",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.1/aria-hidden-body?application=webdriverjs",
      id: "aria-hidden-body",
      impact: null,
      nodes: [
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-hidden-body",
              impact: "critical",
              message: "No aria-hidden attribute is present on document body",
              relatedNodes: [],
            },
          ],
          html: "<body>\n                    Insert  snippet here\n                \n            \n        </body>",
          impact: null,
          none: [],
          target: ["body"],
        },
      ],
      tags: ["cat.aria", "wcag2a", "wcag412"],
    },
  ],
};

const mockSubmission: Submission = {
  id: "1234",
  html: `<h1>This is submission</h1>`,
  css: "body { color: deepseagreen }",
  js: `document.querySelector('h1').style.opacity = 0.5`,
  level: {
    submissions: [],
    requirements: [
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
    ],
  },
};

const factory = ({
  configService = {},
  browserService = {},
}: {
  configService?: PartialFuncReturn<ConfigService>;
  browserService?: PartialFuncReturn<BrowserService>;
} = {}): CheckSubmissionService => {
  return new CheckSubmissionService(
    createMock<ConfigService>({
      get: jest.fn().mockReturnValue(""),
      ...configService,
    }),
    createMock<BrowserService>({
      runAxeChecks: jest.fn().mockResolvedValue(axeMockResult),
      ...browserService,
    }),
  );
};

describe("check submission service", () => {
  it("can check a submission", async () => {
    const service = factory();
    const result = await service.check(mockSubmission);
    expect(result).toBeTruthy();
  });

  it("opens and runs axe checks in a browser", async () => {
    const submissionRendererUrl = "http://target-url.test/";
    const runAxeChecks = jest.fn().mockResolvedValue(axeMockResult);
    const service = factory({
      configService: { get: jest.fn().mockReturnValue(submissionRendererUrl) },
      browserService: { runAxeChecks },
    });

    await service.check(mockSubmission);

    expect(runAxeChecks).toHaveBeenCalledWith(`${submissionRendererUrl}${mockSubmission.id}`, expect.any(Object));
  });

  it("returns a formatted test result", async () => {
    const service = factory();
    const result = await service.check(mockSubmission);

    expect(result.checkedRequirements.length).toEqual(3);
    expect(result.checkedRequirements[0].checkedRules.length).toEqual(1);
    expect(result.checkedRequirements[0].checkedRules[0].passes).toBeFalsy();
    expect(result.checkedRequirements[1].checkedRules.length).toEqual(1);
    expect(result.checkedRequirements[1].checkedRules[0].passes).toBeTruthy();
    expect(result.checkedRequirements[2].checkedRules.length).toEqual(1);
    expect(result.checkedRequirements[2].checkedRules[0].passes).toBeTruthy();
  });
});
