import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WebDriver } from "selenium-webdriver";

import { ElementContainsText } from "@/checks/element-contains-text.check";
import { ElementNotContainsText } from "@/checks/element-not-contains-text.check";
import { Rule } from "@/rule.interface";
import { Submission } from "@/submission.interface";

describe("element-not-contains-text check", () => {
  it("is successful if containsText returns false", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      quit: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementNotContainsText(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url") }),
      createMock<ElementContainsText>({
        containsText: jest.fn().mockResolvedValue(false),
      }),
    );

    const submission: Submission = {
      id: "1",
      css: "",
      js: "",
      html: "",
    };

    const rule: Rule = {
      id: "adsf",
      key: "element-not-contains-text",
      options: {
        selector: "a",
        text: "abc",
      },
    };

    const result = await check.run(submission, rule, webdriver);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if containsText returns true", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      quit: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementNotContainsText(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url") }),
      createMock<ElementContainsText>({
        containsText: jest.fn().mockResolvedValue(true),
      }),
    );

    const submission: Submission = {
      id: "1",
      css: "",
      js: "",
      html: "",
    };

    const rule: Rule = {
      id: "adsf",
      key: "element-not-contains-text",
      options: {
        selector: "a",
        text: "abc",
      },
    };

    const result = await check.run(submission, rule, webdriver);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if there was an error", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      quit: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementNotContainsText(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url") }),
      createMock<ElementContainsText>({
        containsText: jest.fn().mockRejectedValue("rejected"),
      }),
    );

    const submission: Submission = {
      id: "1",
      css: "",
      js: "",
      html: "",
    };

    const rule: Rule = {
      id: "adsf",
      key: "element-not-contains-text",
      options: {
        selector: "a",
        text: "abc",
      },
    };

    const result = await check.run(submission, rule, webdriver);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the selector is missing", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      quit: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementNotContainsText(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url") }),
      createMock<ElementContainsText>({
        containsText: jest.fn().mockResolvedValue(true),
      }),
    );

    const submission: Submission = {
      id: "1",
      css: "",
      js: "",
      html: "",
    };

    const rule: Rule = {
      id: "adsf",
      key: "element-not-contains-text",
      options: {
        text: "abc",
      },
    };

    const result = await check.run(submission, rule, webdriver);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the text is missing", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      quit: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementNotContainsText(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url") }),
      createMock<ElementContainsText>({
        containsText: jest.fn().mockResolvedValue(true),
      }),
    );

    const submission: Submission = {
      id: "1",
      css: "",
      js: "",
      html: "",
    };

    const rule: Rule = {
      id: "adsf",
      key: "element-not-contains-text",
      options: {
        selector: "a",
      },
    };

    const result = await check.run(submission, rule, webdriver);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
