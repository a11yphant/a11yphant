/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { createRule, createSubmission } from "@tests/support/helpers";

import { ElementContainsText, ElementNotContainsText } from "@/submission/checks/base-checks";

describe("element-not-contains-text check", () => {
  const submission = createSubmission();

  const rule = createRule({
    key: "element-not-contains-text",
    options: {
      selector: "a",
      text: "abc",
    },
  });

  it("is successful if containsText returns false", async () => {
    const check = new ElementNotContainsText(
      createMock<Logger>(),
      createMock<ElementContainsText>({
        containsText: jest.fn().mockReturnValue(false),
      }),
    );

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if containsText returns true", async () => {
    const check = new ElementNotContainsText(
      createMock<Logger>(),
      createMock<ElementContainsText>({
        containsText: jest.fn().mockReturnValue(true),
      }),
    );

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the selector is missing", async () => {
    const check = new ElementNotContainsText(
      createMock<Logger>(),
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
    const check = new ElementNotContainsText(
      createMock<Logger>(),
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
