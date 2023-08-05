import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Builder, ThenableWebDriver } from "selenium-webdriver";

import { WebdriverDriverNotSupportedException } from "./exceptions/WebdriverDriverNotSupportedException";

@Injectable()
export class WebdriverFactory {
  constructor(
    private logger: Logger,
    private config: ConfigService,
  ) {}

  async create(): Promise<ThenableWebDriver> {
    const driver = this.config.get<string>("submission-checker.webdriver-driver");
    switch (driver) {
      case "remote":
        return this.createLocalWebdriver();

      default:
        throw new WebdriverDriverNotSupportedException(driver);
    }
  }

  private async createLocalWebdriver(): Promise<ThenableWebDriver> {
    const seleniumEndpoint = this.config.get<string>("submission-checker.webdriver-endpoint");
    this.logger.log(`Starting webdriver session on ${seleniumEndpoint}`, WebdriverFactory.name);
    return await new Builder().forBrowser("chrome").usingServer(seleniumEndpoint).build();
  }
}
