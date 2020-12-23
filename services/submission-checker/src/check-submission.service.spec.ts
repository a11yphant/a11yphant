import { BrowserService } from './browser.service';
import { CheckSubmissionService } from './check-submission.service';
import { createMock, PartialFuncReturn } from '@golevelup/nestjs-testing';
import { ConfigService } from '@nestjs/config';

const factory = ({
  configService = {},
  browserService = {},
}: {
  configService?: PartialFuncReturn<ConfigService>;
  browserService?: PartialFuncReturn<BrowserService>;
} = {}) => {
  return new CheckSubmissionService(
    createMock<ConfigService>({
      get: jest.fn().mockReturnValue(''),
      ...configService,
    }),
    createMock<BrowserService>({
      runAxeChecks: jest.fn().mockResolvedValue({
        violations: [
          {
            description: 'Ensures every HTML document has a lang attribute',
            help: '<html> element must have a lang attribute',
            helpUrl:
              'https://dequeuniversity.com/rules/axe/4.1/html-has-lang?application=webdriverjs',
            id: 'html-has-lang',
            impact: 'serious',
            nodes: [
              {
                all: [],
                any: [
                  {
                    data: {
                      messageKey: 'noLang',
                    },
                    id: 'has-lang',
                    impact: 'serious',
                    message:
                      'The <html> element does not have a lang attribute',
                    relatedNodes: [],
                  },
                ],
                failureSummary:
                  'Fix any of the following:\n  The <html> element does not have a lang attribute',
                html:
                  '<html><head>\n                    <title>Test</title>\n                </head>\n                <body>\n                    Insert snippet here\n                \n            \n        </body></html>',
                impact: 'serious',
                none: [],
                target: ['html'],
              },
            ],
            tags: ['cat.language', 'wcag2a', 'wcag311', 'ACT'],
          },
        ],
      }),
      ...browserService,
    }),
  );
};

describe('check submission service', () => {
  it('can check a submission', async () => {
    const service = factory();

    const result = await service.check(1);

    expect(result).toBeTruthy();
  });

  it('opens and runs axe checks in a browser', async () => {
    const testId = 1;
    const submissionRendererUrl = 'http://target-url.test/';
    const runAxeChecks = jest.fn().mockResolvedValue(null);
    const service = factory({
      configService: { get: jest.fn().mockReturnValue(submissionRendererUrl) },
      browserService: { runAxeChecks },
    });

    await service.check(testId);

    expect(runAxeChecks).toHaveBeenCalledWith(
      `${submissionRendererUrl}${testId}`,
    );
  });
});
