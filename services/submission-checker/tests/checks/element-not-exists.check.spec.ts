import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WebDriver } from "selenium-webdriver";

import { BrowserService } from "../../src/browser.service";
import { ElementNotExists } from "../../src/checks/element-not-exists.check";
import { Rule } from "../../src/rule.interface";
import { Submission } from "../../src/submission.interface";

describe("element-not-exists check", () => {
  it("is successful if the selector was not found", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      findElements: jest.fn().mockResolvedValue(new Array(0)),
      close: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementNotExists(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url") }),
      createMock<BrowserService>({ startSession: jest.fn().mockResolvedValue(webdriver) }),
    );

    const submission: Submission = {
      id: "1",
      css: "",
      js: "",
      html: "",
    };

    const rule: Rule = {
      id: "adsf",
      key: "element-exists",
      options: {
        selector: "a",
      },
    };

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the selector was found", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      findElements: jest.fn().mockResolvedValue(new Array(3)),
      close: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementNotExists(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url") }),
      createMock<BrowserService>({ startSession: jest.fn().mockResolvedValue(webdriver) }),
    );

    const submission: Submission = {
      id: "1",
      css: "",
      js: "",
      html: "",
    };

    const rule: Rule = {
      id: "adsf",
      key: "element-exists",
      options: {
        selector: "a",
      },
    };

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the there was an error", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      findElements: jest.fn().mockRejectedValue(new Array(0)),
      close: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementNotExists(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url") }),
      createMock<BrowserService>({ startSession: jest.fn().mockResolvedValue(webdriver) }),
    );

    const submission: Submission = {
      id: "1",
      css: "",
      js: "",
      html: "",
    };

    const rule: Rule = {
      id: "adsf",
      key: "element-exists",
      options: {
        selector: "a",
      },
    };

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the the selector is missing", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      findElements: jest.fn().mockRejectedValue(new Array(0)),
      close: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementNotExists(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url") }),
      createMock<BrowserService>({ startSession: jest.fn().mockResolvedValue(webdriver) }),
    );

    const submission: Submission = {
      id: "1",
      css: "",
      js: "",
      html: "",
    };

    const rule: Rule = {
      id: "adsf",
      key: "element-exists",
      options: {},
    };

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
