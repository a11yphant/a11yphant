import { Injectable } from '@nestjs/common';
import { Builder, ThenableWebDriver } from 'selenium-webdriver';

@Injectable()
export class WebdriverFactory {
  create(): ThenableWebDriver {
    return new Builder()
      .forBrowser('chrome')
      .usingServer('http://selenium:4444/wd/hub')
      .build();
  }
}
