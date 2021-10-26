import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxeResults } from "axe-core";
import { ThenableWebDriver } from "selenium-webdriver";

import { AxeFactory } from "@/axe.factory";
import { AxeCheck } from "@/checks/axe.check";
import { Rule } from "@/rule.interface";
import { Submission } from "@/submission.interface";

const axeResultSuccess: AxeResults = {
  inapplicable: [],
  incomplete: [],
  passes: [
    {
      description: "Ensures links have discernible text",
      help: "Links must have discernible text",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.1/link-name?application=webdriverjs",
      id: "link-name",
      impact: null,
      nodes: [],
      tags: [],
    },
  ],
  testEngine: { name: "axe-core", version: "4.1.3" },
  testEnvironment: {
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36",
    windowHeight: 849,
    windowWidth: 1042,
  },
  testRunner: { name: "axe" },
  timestamp: "2021-04-09T13:08:13.014Z",
  toolOptions: {},
  url: "http://host.docker.internal:3002/render/cc0cf25b-15cc-4c9b-a63c-bba5853d1281",
  violations: [],
};

const axeResultFailure: AxeResults = {
  inapplicable: [],
  incomplete: [],
  passes: [],
  testEngine: { name: "axe-core", version: "4.1.3" },
  testEnvironment: {
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36",
    windowHeight: 849,
    windowWidth: 1042,
  },
  testRunner: { name: "axe" },
  timestamp: "2021-04-09T13:08:13.014Z",
  toolOptions: {},
  url: "http://host.docker.internal:3002/render/cc0cf25b-15cc-4c9b-a63c-bba5853d1281",
  violations: [
    {
      description: "Ensures links have discernible text",
      help: "Links must have discernible text",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.1/link-name?application=webdriverjs",
      id: "link-name",
      impact: null,
      nodes: [],
      tags: [],
    },
  ],
};

describe("axe check", () => {
  const AxeLinkNameCheck = AxeCheck("link-name");
  it("returns a successful result when the check was successful", async () => {
    const check = new AxeLinkNameCheck(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url") }),
      createMock<AxeFactory>({
        create: jest.fn().mockReturnValue({
          analyze: jest.fn().mockResolvedValue(axeResultSuccess),
        }),
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
      key: "test-rule",
      options: {},
    };

    const result = await check.run(
      submission,
      rule,
      createMock<ThenableWebDriver>({
        get: jest.fn().mockResolvedValue(null),
      }),
    );

    expect(result.status).toEqual("success");
  });

  it("returns a failure result when the check was not successful", async () => {
    const check = new AxeLinkNameCheck(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url") }),
      createMock<AxeFactory>({
        create: jest.fn().mockReturnValue({
          analyze: jest.fn().mockReturnValue(axeResultFailure),
        }),
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
      key: "test-rule",
      options: {},
    };

    const result = await check.run(
      submission,
      rule,
      createMock<ThenableWebDriver>({
        get: jest.fn().mockResolvedValue(null),
      }),
    );

    expect(result.status).toEqual("failed");
  });

  it("returns an error result when there was an error while executing the test", async () => {
    const check = new AxeLinkNameCheck(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url") }),
      createMock<AxeFactory>({
        create: jest.fn().mockReturnValue({
          analyze: jest.fn().mockRejectedValue(new Error("error")),
        }),
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
      key: "test-rule",
      options: {},
    };

    const result = await check.run(
      submission,
      rule,
      createMock<ThenableWebDriver>({
        get: jest.fn().mockResolvedValue(null),
      }),
    );

    expect(result.status).toEqual("error");
  });
});
