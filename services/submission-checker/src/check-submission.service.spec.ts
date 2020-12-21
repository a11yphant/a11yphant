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
      runAxeChecks: jest.fn().mockResolvedValue(null),
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

  it('opens runs axe checks in a browser', async () => {
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
