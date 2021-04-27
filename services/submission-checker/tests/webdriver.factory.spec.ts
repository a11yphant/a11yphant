import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import AWS from "aws-sdk-mock";

import { WebdriverDriverNotSupportedException } from "../src/exceptions/WebdriverDriverNotSupportedException";
import { WebdriverFactory } from "../src/webdriver.factory";

describe("webdriver factory", () => {
  afterEach(() => {
    AWS.restore();
  });

  it("creates a webdriver for remote selenium", async () => {
    const configService = new ConfigService({
      "submission-checker.webdriver-driver": "remote",
      "submission-checker.webdriver-endpoint": "https://webdriver.url/hub",
    });
    const factory = new WebdriverFactory(createMock<Logger>(), configService);

    const driver = await factory.create();

    expect(driver).toBeTruthy();
  });

  it("throws an exception if the configured driver is not supported", async () => {
    const configService = new ConfigService({
      "submission-checker.webdriver-driver": "this-one-is-not-supported",
    });
    const factory = new WebdriverFactory(createMock<Logger>(), configService);

    expect(factory.create()).rejects.toBeInstanceOf(WebdriverDriverNotSupportedException);
  });

  it("creates a webdriver for aws device farm", async () => {
    AWS.mock("DeviceFarm", "createTestGridUrl", (params, callback) => {
      callback(null, {
        url: "http://testgrid.url/hub",
      });
    });

    const configService = new ConfigService({
      "submission-checker.webdriver-driver": "aws-device-farm",
      "submission-checker.webdriver-aws-device-farm-project": "arn:project:id",
    });
    const factory = new WebdriverFactory(createMock<Logger>(), configService);

    const driver = await factory.create();

    expect(driver).toBeTruthy();
  });

  it("creates a webdriver for local webdriver", async () => {
    const configService = new ConfigService({
      "submission-checker.webdriver-driver": "local",
    });
    const factory = new WebdriverFactory(createMock<Logger>(), configService);

    const driver = await factory.create();

    expect(driver).toBeTruthy();
  });
});
