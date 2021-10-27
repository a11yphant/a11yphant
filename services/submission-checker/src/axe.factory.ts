import AxeBuilder from "@axe-core/webdriverjs";
import { Injectable } from "@nestjs/common";
import { RunOptions } from "axe-core";
import { WebDriver } from "selenium-webdriver";

@Injectable()
export class AxeFactory {
  create(driver: WebDriver, options: RunOptions): AxeBuilder {
    return new AxeBuilder(driver).options(options);
  }
}
