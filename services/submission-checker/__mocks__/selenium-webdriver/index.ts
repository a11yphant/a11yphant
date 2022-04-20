import { createMock } from "@golevelup/nestjs-testing";
import { Builder as SeleniumBuilder, ThenableWebDriver } from "selenium-webdriver";

export class Builder extends SeleniumBuilder {
  forBrowser(browser: string, otp_version?: string, opt_platform?: string): Builder {
    return this;
  }

  usingServer(url: string): Builder {
    return this;
  }

  setChromeOptions(options: unknown): Builder {
    return this;
  }

  build(): ThenableWebDriver {
    return createMock<ThenableWebDriver>({ quit: jest.fn().mockReturnValue(null) });
  }
}

export { By } from "selenium-webdriver";
