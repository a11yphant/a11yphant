import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { createRule, createSubmission } from "@tests/support/helpers";

import { DocumentLanguageIsSpecified } from "@/submission/checks/base-checks/document-language-is-specified.check";

describe("document-language-is-specified", () => {
  const rule = createRule({ key: "document-language-is-specified", options: { languages: "en,en-us" } });
  const submission = createSubmission({ id: "1" });

  it("is successful if the language is specified", async () => {
    submission.html = `<!doctype html><html lang="en"></html>`;
    const check = new DocumentLanguageIsSpecified(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the language is not correct", async () => {
    submission.html = `<!doctype html><html lang="de"></html>`;
    const check = new DocumentLanguageIsSpecified(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the language is not specified", async () => {
    submission.html = `<!doctype html><html></html>`;
    const check = new DocumentLanguageIsSpecified(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the language is missing on the rule", async () => {
    const rule = createRule({ key: "document-language-is-specified", options: {} });
    submission.html = `<!doctype html><html lang="en"></html>`;
    const check = new DocumentLanguageIsSpecified(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
