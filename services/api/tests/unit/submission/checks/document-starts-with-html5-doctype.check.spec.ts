import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DocumentStartsWithHtml5Doctype } from "@/submission/checks/base-checks/document-starts-with-html5-doctype.check";

import { createRule, createSubmission, mockSubmissionApi, mockSubmissionApiError } from "../helpers";

describe("document-starts-with-html5-doctype check", () => {
  const submission = createSubmission();
  const rule = createRule({ key: "document-starts-with-html5-doctype" });

  it("returns success for a document starting with a doctype", async () => {
    const fetch = mockSubmissionApi(submission.id, "<!doctype html>");

    const check = new DocumentStartsWithHtml5Doctype(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("returns success for a document starting with whitespace followed by a doctype", async () => {
    const fetch = mockSubmissionApi(submission.id, "   \n\n  <!doctype html>");

    const check = new DocumentStartsWithHtml5Doctype(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if there is no doctype", async () => {
    const fetch = mockSubmissionApi(submission.id, "no-doctype");

    const check = new DocumentStartsWithHtml5Doctype(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("returns success if the document starts with a comment followed by the doctype", async () => {
    const fetch = mockSubmissionApi(submission.id, "<!-- html comment -->\n<!doctype html>");

    const check = new DocumentStartsWithHtml5Doctype(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("returns an error if fetching the document fails", async () => {
    const fetch = mockSubmissionApiError(new Error("some error"));

    const check = new DocumentStartsWithHtml5Doctype(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
