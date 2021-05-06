import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ThenableWebDriver } from "selenium-webdriver";

import { BrowserService } from "../src/browser.service";
import { WebdriverFactory } from "../src/webdriver.factory";

describe("browser service", () => {
  it("can run axe checks on a website", async () => {
    const browser = new BrowserService(
      createMock<Logger>(),
      createMock<WebdriverFactory>({
        create: jest.fn().mockReturnValue(
          createMock<ThenableWebDriver>({
            get: jest.fn().mockResolvedValue(null),
            quit: jest.fn().mockResolvedValue(null),
          }),
        ),
      }),
    );

    const result = await browser.runAxeChecks(`http://rendered-submission-url/1`, {
      runOnly: ["landmark-one-main"],
    });

    expect(result).toBeTruthy();
  });

  it("quits the driver when the check did not fail", async () => {
    const quit = jest.fn().mockResolvedValue(null);
    const browser = new BrowserService(
      createMock<Logger>(),
      createMock<WebdriverFactory>({
        create: jest.fn().mockReturnValue(
          createMock<ThenableWebDriver>({
            get: jest.fn().mockResolvedValue(null),
            quit,
          }),
        ),
      }),
    );

    await browser.runAxeChecks(`http://rendered-submission-url/1`, {
      runOnly: ["landmark-one-main"],
    });

    expect(quit).toHaveBeenCalled();
  });

  it("quits the driver when loading the submission failed", async () => {
    const quit = jest.fn().mockResolvedValue(null);
    const browser = new BrowserService(
      createMock<Logger>(),
      createMock<WebdriverFactory>({
        create: jest.fn().mockReturnValue(
          createMock<ThenableWebDriver>({
            get: jest.fn().mockRejectedValue({ error: "failed" }),
            quit,
          }),
        ),
      }),
    );

    await browser.runAxeChecks(`http://rendered-submission-url/1`, {
      runOnly: ["landmark-one-main"],
    });

    expect(quit).toHaveBeenCalled();
  });
});
