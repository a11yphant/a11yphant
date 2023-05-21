import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fetchMock from "fetch-mock-jest";
import nodeFetch from "node-fetch";

import { ElementExists } from "@/checks/element-exists.check";
import { Rule } from "@/rule.interface";
import { Submission } from "@/submission.interface";

describe("element-exists check", () => {
  it("is successful if the selector was found", async () => {
    const fetch = fetchMock.sandbox().get("url/1", `<!doctype html><html><a href=""></a></html>`) as unknown as typeof nodeFetch;

    const check = new ElementExists(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

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

  it("fails if the selector was not found", async () => {
    const fetch = fetchMock.sandbox().get("url/1", "<!doctype><html></html>") as unknown as typeof nodeFetch;

    const check = new ElementExists(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

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
    const fetch = jest.fn().mockRejectedValue(new Error()) as unknown as typeof nodeFetch;

    const check = new ElementExists(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

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
    const fetch = fetchMock.sandbox().get("url/1", "") as unknown as typeof nodeFetch;

    const check = new ElementExists(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

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
