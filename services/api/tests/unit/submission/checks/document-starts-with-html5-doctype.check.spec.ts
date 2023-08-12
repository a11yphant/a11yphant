import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { createRule, createSubmission } from "@tests/support/helpers";

import { DocumentStartsWithHtml5Doctype } from "@/submission/checks/base-checks/document-starts-with-html5-doctype.check";

describe("document-starts-with-html5-doctype check", () => {
  const submission = createSubmission();
  const rule = createRule({ key: "document-starts-with-html5-doctype" });

  it("returns success for a document starting with a doctype", async () => {
    submission.html = "<!doctype html>";

    const check = new DocumentStartsWithHtml5Doctype(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("returns success for a document starting with whitespace followed by a doctype", async () => {
    submission.html = "   \n\n  <!doctype html>";

    const check = new DocumentStartsWithHtml5Doctype(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if there is no doctype", async () => {
    submission.html = "no-doctype";

    const check = new DocumentStartsWithHtml5Doctype(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("returns success if the document starts with a comment followed by the doctype", async () => {
    submission.html = "<!-- html comment -->\n<!doctype html>";

    const check = new DocumentStartsWithHtml5Doctype(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });
});
