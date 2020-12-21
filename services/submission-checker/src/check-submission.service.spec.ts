import { BrowserService } from './browser.service';
import { CheckSubmissionService } from './check-submission.service';
import { createMock } from '@golevelup/nestjs-testing';

describe('check submission service', () => {
  it('can check a submission', async () => {
    const service = new CheckSubmissionService(
      createMock<BrowserService>({
        runAxeChecks: jest.fn().mockResolvedValue(null),
      }),
    );

    const result = await service.check(1);

    expect(result).toBeTruthy();
  });

  it('opens runs axe checks in a browser', async () => {
    const runAxeChecks = jest.fn().mockResolvedValue(null);
    const service = new CheckSubmissionService(
      createMock<BrowserService>({ runAxeChecks }),
    );

    await service.check(1);

    expect(runAxeChecks).toHaveBeenCalledWith(
      `http://submission-renderer-url/1`,
    );
  });
});
