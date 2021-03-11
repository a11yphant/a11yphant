import AxeBuilder from "@axe-core/webdriverjs";
import { Injectable } from "@nestjs/common";
import { AxeResults } from "axe-core";

import { WebdriverFactory } from "./webdriver.factory";

@Injectable()
export class BrowserService {
  constructor(private factory: WebdriverFactory) {}

  // TODO adapt return value type
  async runAxeChecks(url: string, options: unknown): Promise<AxeResults> {
    const driver = this.factory.create();
    await driver.get(url);
    const axe = new AxeBuilder(driver).options(options);
    const result = (await axe.analyze()) as AxeResults;
    await driver.quit();

    return result;
  }
}
