import { Injectable } from '@nestjs/common';
import AxeBuilder from '@axe-core/webdriverjs';
import { WebdriverFactory } from './webdriver.factory';

@Injectable()
export class BrowserService {
  constructor(private factory: WebdriverFactory) {}

  async runAxeChecks(url: string): Promise<boolean> {
    const driver = this.factory.create();
    await driver.get(url);
    const axe = new AxeBuilder(driver).options();
    const result = await axe.analyze();

    return true;
  }
}
