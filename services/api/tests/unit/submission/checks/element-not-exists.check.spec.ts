import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fetchMock from "fetch-mock-jest";
import nodeFetch from "node-fetch";

import { ElementNotExists } from "@/submission/checks/base-checks/element-not-exists.check";

import { createRule, createSubmission } from "../helpers";

describe("element-not-exists check", () => {
  const submission = createSubmission({
    id: "1",
  });

  const rule = createRule({
    key: "element-exists",
    options: {
      selector: "a",
    },
  });

  it("is successful if the selector was not found", async () => {
    const fetch = fetchMock.sandbox().get("url/1", "<!doctype html><html></html>") as unknown as typeof nodeFetch;

    const check = new ElementNotExists(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the selector was found", async () => {
    const fetch = fetchMock.sandbox().get("url/1", `<!doctype html><html><a href=""></a></html>`) as unknown as typeof nodeFetch;

    const check = new ElementNotExists(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the there was an error", async () => {
    const fetch = jest.fn().mockRejectedValue(new Error()) as unknown as typeof nodeFetch;

    const check = new ElementNotExists(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the the selector is missing", async () => {
    const fetch = fetchMock.sandbox().get("url/1", "") as unknown as typeof nodeFetch;

    const rule = createRule({
      key: "element-exists",
      options: {},
    });

    const check = new ElementNotExists(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
