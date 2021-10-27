import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ThenableWebDriver } from "selenium-webdriver";

import { BrowserService } from "@/browser.service";
import { WebdriverFactory } from "@/webdriver.factory";

describe("browser service", () => {
  it("can create a webdriver session", async () => {
    const browser = new BrowserService(
      createMock<Logger>(),
      createMock<WebdriverFactory>({
        create: jest.fn().mockReturnValue(createMock<ThenableWebDriver>()),
      }),
    );

    const session = await browser.startSession();

    expect(session).toBeTruthy();
  });
});
