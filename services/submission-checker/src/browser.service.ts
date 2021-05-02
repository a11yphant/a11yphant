import AxeBuilder from "@axe-core/webdriverjs";
import { Injectable, Logger } from "@nestjs/common";
import { AxeResults } from "axe-core";

import { WebdriverFactory } from "./webdriver.factory";

@Injectable()
export class BrowserService {
  constructor(private logger: Logger, private factory: WebdriverFactory) {}

  // TODO adapt return value type
  async runAxeChecks(url: string, options: unknown): Promise<AxeResults> {
    this.logger.log(`Creating a webdriver`, BrowserService.name);
    const driver = await this.factory.create();
    this.logger.log(`Webdriver created`, BrowserService.name);
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
