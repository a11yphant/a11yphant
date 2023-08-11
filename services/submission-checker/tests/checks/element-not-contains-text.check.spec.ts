import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createRule, createSubmission } from "@tests/helpers";
import fetchMock from "fetch-mock-jest";
import nodeFetch from "node-fetch";

import { ElementContainsText } from "@/checks/element-contains-text.check";
import { ElementNotContainsText } from "@/checks/element-not-contains-text.check";

describe("element-not-contains-text check", () => {
  const submission = createSubmission({
    id: "1",
  });

  const rule = createRule({
    key: "element-not-contains-text",
    options: {
      selector: "a",
      text: "abc",
    },
  });

  it("is successful if containsText returns false", async () => {
    const fetch = fetchMock.sandbox().get("url/1", "") as unknown as typeof nodeFetch;

    const check = new ElementNotContainsText(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url/") }),
      fetch,
      createMock<ElementContainsText>({
        containsText: jest.fn().mockReturnValue(false),
      }),
    );

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if containsText returns true", async () => {
    const fetch = fetchMock.sandbox().get("url/1", "") as unknown as typeof nodeFetch;

    const check = new ElementNotContainsText(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url/") }),
      fetch,
      createMock<ElementContainsText>({
        containsText: jest.fn().mockReturnValue(true),
      }),
    );

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the selector is missing", async () => {
    const fetch = fetchMock.sandbox().get("url/1", "") as unknown as typeof nodeFetch;

    const check = new ElementNotContainsText(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url/") }),
      fetch,
      createMock<ElementContainsText>({
        containsText: jest.fn().mockReturnValue(true),
      }),
    );

    const rule = createRule({
      key: "element-not-contains-text",
      options: {
        text: "abc",
      },
    });

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the text is missing", async () => {
    const fetch = fetchMock.sandbox().get("url/1", "") as unknown as typeof nodeFetch;

    const check = new ElementNotContainsText(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "url/") }),
      fetch,
      createMock<ElementContainsText>({
        containsText: jest.fn().mockReturnValue(true),
      }),
    );

    const rule = createRule({
      key: "element-not-contains-text",
      options: {
        selector: "a",
      },
    });

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
