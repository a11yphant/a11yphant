import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import AWS from "aws-sdk";
import { mkdir, mkdtemp } from "fs/promises";
import { join } from "path";
import { Builder, ThenableWebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

import { WebdriverDriverNotSupportedException } from "./exceptions/WebdriverDriverNotSupportedException";

@Injectable()
export class WebdriverFactory {
  constructor(private logger: Logger, private config: ConfigService) {}

  async create(): Promise<ThenableWebDriver> {
    const driver = this.config.get<string>("submission-checker.webdriver-driver");
    switch (driver) {
      case "remote":
        return this.createLocalWebdriver();
      case "aws-device-farm":
        return this.createAwsDeviceFarmWebdriver();
      case "local":
        return this.createLocalChromiumWebdriver();

      default:
        throw new WebdriverDriverNotSupportedException(driver);
    }
  }

  private async createLocalWebdriver(): Promise<ThenableWebDriver> {
    const seleniumEndpoint = this.config.get<string>("submission-checker.webdriver-endpoint");
    this.logger.log(`Starting webdriver session on ${seleniumEndpoint}`, WebdriverFactory.name);
    return await new Builder().forBrowser("chrome").usingServer(seleniumEndpoint).build();
  }

  private async createAwsDeviceFarmWebdriver(): Promise<ThenableWebDriver> {
    // device farm currently is only available in us-west-2
    this.logger.log("Creating DeviceFarm url", WebdriverFactory.name);
    const devicefarm = new AWS.DeviceFarm({ region: "us-west-2" });
    const { url } = await devicefarm
      .createTestGridUrl({
        projectArn: this.config.get<string>("submission-checker.webdriver-aws-device-farm-project"),
        expiresInSeconds: 60,
      })
      .promise();

    this.logger.log("Starting ebdriver session on DeviceFarm", WebdriverFactory.name);

    return await new Builder().usingServer(url).withCapabilities({ browserName: "chrome" }).build();
  }

  private async createLocalChromiumWebdriver(): Promise<ThenableWebDriver> {
    this.logger.log(`Starting webdriver session using a local chromium installation`, WebdriverFactory.name);

    const tmpPath = await mkdtemp("/tmp/chrome-");
    const userDataPath = await mkdir(join(tmpPath, "user-data"));
    const dataPath = await mkdir(join(tmpPath, "data"));
    const cachePath = await mkdir(join(tmpPath, "cache"));

    const options = new chrome.Options()
      .headless()
      .addArguments(
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
        "--no-sandbox",
        "--no-zygote",
        `--user-data-dir=${userDataPath}`,
        `--data-path=${dataPath}`,
        `--homedir=${tmpPath}`,
        `--disk-cache-dir=${cachePath}`,
        "--disable-setuid-sandbox",
        "--window-size=1920,1080",
        "--remote-debugging-port=9222",
        "--enable-logging",
        "--log-level=0",
      );
    return await new Builder().forBrowser("chrome").setChromeOptions(options).build();
  }
}
