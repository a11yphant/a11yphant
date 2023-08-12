import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { ElementContainsText } from "@/submission/checks/base-checks/element-contains-text.check";

import { createRule, createSubmission, mockSubmissionApi } from "../helpers";

describe("element-contains-text check", () => {
  const rule = createRule({ key: "element-contains-text", options: { selector: "a", text: "abc" } });
  const submission = createSubmission({ id: "1" });

  it("is successful if the element and the text is in the document", async () => {
    const fetch = mockSubmissionApi(submission.id, `<!doctype html><a href="">abc</a>`);
    const check = new ElementContainsText(createMock<Logger>(), fetch);

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the node is not in the document", async () => {
    const fetch = mockSubmissionApi(submission.id, `<!doctype html>`);
    const check = new ElementContainsText(createMock<Logger>(), fetch);

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the selector is missing", async () => {
    const rule = createRule({ options: { text: "text" } });
    const fetch = mockSubmissionApi(submission.id, `<!doctype html>`);
    const check = new ElementContainsText(createMock<Logger>(), fetch);

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the text is missing", async () => {
    const rule = createRule({ options: { selector: "a" } });
    const fetch = mockSubmissionApi(submission.id, `<!doctype html><a href="">not-the-text</a>`);
    const check = new ElementContainsText(createMock<Logger>(), fetch);

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
