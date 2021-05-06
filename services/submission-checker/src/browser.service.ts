import AxeBuilder from "@axe-core/webdriverjs";
import { Injectable, Logger } from "@nestjs/common";
import { AxeResults } from "axe-core";
import { ThenableWebDriver } from "selenium-webdriver";

import { WebdriverFactory } from "./webdriver.factory";

@Injectable()
export class BrowserService {
  constructor(private logger: Logger, private factory: WebdriverFactory) {}

  async startSession(): Promise<ThenableWebDriver> {
    this.logger.log(`Creating a webdriver`, BrowserService.name);
    const driver = await this.factory.create();
    this.logger.log(`Webdriver created`, BrowserService.name);

    return driver;
  }

  async runAxeChecks(url: string, options: unknown): Promise<AxeResults> {
    const driver = await this.startSession();

    try {
      this.logger.log(`Opening ${url}`, BrowserService.name);
      await driver.get(url);
      this.logger.log(`Executing axe check ${url}`, BrowserService.name);
      const axe = new AxeBuilder(driver).options(options);
      const result = (await axe.analyze()) as AxeResults;

      return result;
    } catch (error) {
      this.logger.error(error, error.trace, BrowserService.name);
    } finally {
      this.logger.log(`Closing webdriver`, BrowserService.name);
      await driver.quit();
    }
  }
}
