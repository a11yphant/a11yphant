import { Injectable, Logger } from "@nestjs/common";
import { ThenableWebDriver } from "selenium-webdriver";

import { WebdriverFactory } from "./webdriver.factory";

@Injectable()
export class BrowserService {
  constructor(
    private logger: Logger,
    private factory: WebdriverFactory,
  ) {}

  async startSession(): Promise<ThenableWebDriver> {
    this.logger.log(`Creating a webdriver`, BrowserService.name);
    const driver = await this.factory.create();
    this.logger.log(`Webdriver created`, BrowserService.name);

    return driver;
  }
}
