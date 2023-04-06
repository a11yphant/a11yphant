import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WebDriver } from "selenium-webdriver";

import { ElementContainsText } from "@/checks/element-contains-text.check";
import { Rule } from "@/rule.interface";
import { Submission } from "@/submission.interface";

describe("element-contains-text containsText", () => {
  it("returns true if the selector was found and contains the text", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      findElements: jest.fn().mockResolvedValue(new Array({ getText: jest.fn().mockResolvedValue("abcdef") })),
      quit: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementContainsText(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url") }));

    const result = await check.containsText(webdriver, { selector: "a", text: "abc" });

    expect(result).toBe(true);
  });

  it("returns true if the selector was found multiple times and one contains the text", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      findElements: jest.fn().mockResolvedValue([{ getText: jest.fn().mockResolvedValue("abc") }, { getText: jest.fn().mockResolvedValue("def") }]),
      quit: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementContainsText(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url") }));

    const result = await check.containsText(webdriver, { selector: "a", text: "abc" });

    expect(result).toBe(true);
  });

  it("returns false if the selector was found but doesn't contain the text", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      findElements: jest.fn().mockResolvedValue(new Array({ getText: jest.fn().mockResolvedValue("def") })),
      quit: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementContainsText(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url") }));

    const result = await check.containsText(webdriver, { selector: "a", text: "abc" });

    expect(result).toBe(false);
  });

  it("returns false if the selector wasn't found", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      findElements: jest.fn().mockResolvedValue(new Array(0)),
      quit: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementContainsText(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url") }));

    const result = await check.containsText(webdriver, { selector: "a", text: "abc" });

    expect(result).toBe(false);
  });
});

describe("element-contains-text check", () => {
  it("is successful if containsText returns true", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      quit: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementContainsText(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url") }));
    const spy = jest.spyOn(check, "containsText").mockImplementation().mockResolvedValue(true);

    const submission: Submission = {
      id: "1",
      css: "",
      js: "",
      html: "",
    };

    const rule: Rule = {
      id: "adsf",
      key: "element-contains-text",
      options: {
        selector: "a",
        text: "abc",
      },
    };

    const result = await check.run(submission, rule, webdriver);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");

    spy.mockRestore();
  });

  it("fails if containsText returns false", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      quit: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementContainsText(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url") }));
    const spy = jest.spyOn(check, "containsText").mockImplementation().mockResolvedValue(false);

    const submission: Submission = {
      id: "1",
      css: "",
      js: "",
      html: "",
    };

    const rule: Rule = {
      id: "adsf",
      key: "element-contains-text",
      options: {
        selector: "a",
        text: "abc",
      },
    };

    const result = await check.run(submission, rule, webdriver);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");

    spy.mockRestore();
  });

  it("errors if there was an error", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      quit: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementContainsText(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url") }));
    const spy = jest.spyOn(check, "containsText").mockImplementation().mockRejectedValue("rejected");

    const submission: Submission = {
      id: "1",
      css: "",
      js: "",
      html: "",
    };

    const rule: Rule = {
      id: "adsf",
      key: "element-contains-text",
      options: {
        selector: "a",
        text: "abc",
      },
    };

    const result = await check.run(submission, rule, webdriver);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");

    spy.mockRestore();
  });

  it("errors if the selector is missing", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      quit: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementContainsText(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url") }));
    const spy = jest.spyOn(check, "containsText").mockImplementation(() => Promise.resolve(true));

    const submission: Submission = {
      id: "1",
      css: "",
      js: "",
      html: "",
    };

    const rule: Rule = {
      id: "adsf",
      key: "element-contains-text",
      options: {
        text: "abc",
      },
    };

    const result = await check.run(submission, rule, webdriver);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");

    spy.mockRestore();
  });

  it("errors if the text is missing", async () => {
    const webdriver = createMock<WebDriver>({
      get: jest.fn().mockResolvedValue(null),
      quit: jest.fn().mockResolvedValue(null),
    });

    const check = new ElementContainsText(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url") }));
    const spy = jest.spyOn(check, "containsText").mockImplementation(() => Promise.resolve(true));

    const submission: Submission = {
      id: "1",
      css: "",
      js: "",
      html: "",
    };

    const rule: Rule = {
      id: "adsf",
      key: "element-contains-text",
      options: {
        selector: "a",
      },
    };

    const result = await check.run(submission, rule, webdriver);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");

    spy.mockRestore();
  });
});
