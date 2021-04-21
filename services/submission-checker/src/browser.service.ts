import AxeBuilder from "@axe-core/webdriverjs";
import { Injectable, Logger } from "@nestjs/common";
import { AxeResults } from "axe-core";

import { WebdriverFactory } from "./webdriver.factory";

@Injectable()
export class BrowserService {
  constructor(private logger: Logger, private factory: WebdriverFactory) {}

  // TODO adapt return value type
  async runAxeChecks(url: string, options: unknown): Promise<AxeResults> {
    const driver = await this.factory.create();
    try {
      await driver.get(url);
      const axe = new AxeBuilder(driver).options(options);
      const result = (await axe.analyze()) as AxeResults;

      return result;
    } catch (error) {
      this.logger.error(error, error.trace, BrowserService.name);
    } finally {
      await driver.quit();
    }
  }
}
