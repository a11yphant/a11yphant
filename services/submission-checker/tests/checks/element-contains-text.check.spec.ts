import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fetchMock from "fetch-mock-jest";
import nodeFetch from "node-fetch";

import { ElementContainsText } from "@/checks/element-contains-text.check";
import { Rule } from "@/rule.interface";
import { Submission } from "@/submission.interface";

describe("element-contains-text check", () => {
  it("is successful if the element and the text is in the document", async () => {
    const fetch = fetchMock.sandbox().get("url/1", `<!doctype html><a href="">abc</a>`) as unknown as typeof nodeFetch;

    const check = new ElementContainsText(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

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

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the node is not in the document", async () => {
    const fetch = fetchMock.sandbox().get("url/1", "<!doctype html>") as unknown as typeof nodeFetch;

    const check = new ElementContainsText(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

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

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the selector is missing", async () => {
    const fetch = fetchMock.sandbox().get("url/1", "<!doctype html>") as unknown as typeof nodeFetch;

    const check = new ElementContainsText(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

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

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the text is missing", async () => {
    const fetch = fetchMock.sandbox().get("url/1", `<!doctype html><a href="">not-the-text</a>`) as unknown as typeof nodeFetch;

    const check = new ElementContainsText(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

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

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
