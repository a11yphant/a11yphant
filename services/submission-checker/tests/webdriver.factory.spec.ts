import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { WebdriverDriverNotSupportedException } from "@/exceptions/WebdriverDriverNotSupportedException";
import { WebdriverFactory } from "@/webdriver.factory";

describe("webdriver factory", () => {
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

    expect(factory.create()).rejects.toThrowError(WebdriverDriverNotSupportedException);
  });
});
