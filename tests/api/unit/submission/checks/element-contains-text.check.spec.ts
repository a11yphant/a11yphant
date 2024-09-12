/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { createRule, createSubmission } from "@tests/support/helpers";

import { ElementContainsText } from "@/submission/checks/base-checks";

describe("element-contains-text check", () => {
  const rule = createRule({ key: "element-contains-text", options: { selector: "a", text: "abc" } });
  const submission = createSubmission({ id: "1" });

  it("is successful if the element and the text is in the document", async () => {
    submission.html = `<!doctype html><a href="">abc</a>`;
    const check = new ElementContainsText(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the node is not in the document", async () => {
    submission.html = `<!doctype html>`;
    const check = new ElementContainsText(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the selector is missing", async () => {
    const rule = createRule({ options: { text: "text" } });
    submission.html = `<!doctype html>`;
    const check = new ElementContainsText(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the text is missing", async () => {
    const rule = createRule({ options: { selector: "a" } });
    submission.html = `<!doctype html><a href="">not-the-text</a>`;
    const check = new ElementContainsText(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
