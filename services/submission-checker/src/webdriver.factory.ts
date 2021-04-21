import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import AWS from "aws-sdk";
import { Builder, ThenableWebDriver } from "selenium-webdriver";

import { WebdriverDriverNotSupportedException } from "./exceptions/WebdriverDriverNotSupportedException";

@Injectable()
export class WebdriverFactory {
  constructor(private config: ConfigService) {}

  async create(): Promise<ThenableWebDriver> {
    const driver = this.config.get<string>("submission-checker.webdriver-driver");
    switch (driver) {
      case "local":
        return this.createLocalWebdriver();
      case "aws-device-farm":
        return this.createAwsDeviceFarmWebdriver();

      default:
        throw new WebdriverDriverNotSupportedException(driver);
    }
  }

  private async createLocalWebdriver(): Promise<ThenableWebDriver> {
    return await Promise.resolve(
      new Builder().forBrowser("chrome").usingServer(this.config.get<string>("submission-checker.webdriver-endpoint")).build(),
    );
  }

  private async createAwsDeviceFarmWebdriver(): Promise<ThenableWebDriver> {
    // device farm currently is only available in us-west-2
    const devicefarm = new AWS.DeviceFarm({ region: "us-west-2" });
    const { url } = await devicefarm
      .createTestGridUrl({
        projectArn: this.config.get<string>("submission-checker.webdriver-aws-device-farm-project"),
        expiresInSeconds: 30,
      })
      .promise();

    return new Builder().forBrowser("chrome").usingServer(url).build();
  }
}
