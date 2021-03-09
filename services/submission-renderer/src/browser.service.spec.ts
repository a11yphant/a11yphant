import { createMock } from '@golevelup/nestjs-testing';
import { ThenableWebDriver } from 'selenium-webdriver';

import { BrowserService } from './browser.service';
import { WebdriverFactory } from './webdriver.factory';

describe('browser service', () => {
  it('can run axe checks on a website', async () => {
    const browser = new BrowserService(
      createMock<WebdriverFactory>({
        create: jest.fn().mockReturnValue(
          createMock<ThenableWebDriver>({
            get: jest.fn().mockResolvedValue(null),
            quit: jest.fn().mockResolvedValue(null),
          }),
        ),
      }),
    );

    const result = await browser.runAxeChecks(
      `http://rendered-submission-url/1`,
      {
        runOnly: ['landmark-one-main'],
      },
    );

    expect(result).toBeTruthy();
  });
});
