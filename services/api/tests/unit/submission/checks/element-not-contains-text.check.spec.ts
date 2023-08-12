import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import fetchMock from "fetch-mock-jest";
import nodeFetch from "node-fetch";

import { ElementContainsText } from "@/submission/checks/base-checks/element-contains-text.check";
import { ElementNotContainsText } from "@/submission/checks/base-checks/element-not-contains-text.check";

import { createRule, createSubmission } from "../helpers";

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
