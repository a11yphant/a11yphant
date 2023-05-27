import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createRule, createSubmission, mockSubmissionApi } from "@tests/helpers";

import { DocumentLanguageIsSpecified } from "@/checks/document-language-is-specified.check";

describe("document-language-is-specified", () => {
  const rule = createRule({ key: "document-language-is-specified", options: { languages: "en,en-us" } });
  const submission = createSubmission({ id: "1" });

  it("is successful if the language is specified", async () => {
    const fetch = mockSubmissionApi(submission.id, `<!doctype html><html lang="en"></html>`);
    const check = new DocumentLanguageIsSpecified(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the language is not correct", async () => {
    const fetch = mockSubmissionApi(submission.id, `<!doctype html><html lang="de"></html>`);
    const check = new DocumentLanguageIsSpecified(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the language is not specified", async () => {
    const fetch = mockSubmissionApi(submission.id, `<!doctype html><html></html>`);
    const check = new DocumentLanguageIsSpecified(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the language is missing on the rule", async () => {
    const rule = createRule({ key: "document-language-is-specified", options: {} });
    const fetch = mockSubmissionApi(submission.id, `<!doctype html><html lang="en"></html>`);
    const check = new DocumentLanguageIsSpecified(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
