import { Injectable } from '@nestjs/common';
import AxeBuilder from '@axe-core/webdriverjs';
import { WebdriverFactory } from './webdriver.factory';

@Injectable()
export class BrowserService {
  constructor(private factory: WebdriverFactory) {}

  // TODO adapt return value type
  async runAxeChecks(url: string): Promise<any> {
    const driver = this.factory.create();
    await driver.get(url);
    const axe = new AxeBuilder(driver).options();
    const result = axe.analyze();
    await driver.quit();

    return result;
  }
}
