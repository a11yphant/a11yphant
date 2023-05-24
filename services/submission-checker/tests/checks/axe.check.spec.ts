import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createRule, createSubmission } from "@tests/helpers";
import fetchMock from "fetch-mock-jest";

import { AxeCheck } from "@/checks/axe.check";

describe("axe check", () => {
  const AxeLinkNameCheck = AxeCheck("link-name");
  it("returns a successful result when the check was successful", async () => {
    const fetch = fetchMock.sandbox().get("url/1", `<!doctype html><a href="https://a11yphant.com">Go to a11yphant.com</a>`);
    const check = new AxeLinkNameCheck(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

    const submission = createSubmission({ id: "1" });
    const rule = createRule();

    const result = await check.run(submission, rule);

    expect(result.status).toEqual("success");
  });

  it("returns a failure result when the check was not successful", async () => {
    const fetch = fetchMock.sandbox().get("url/1", `<!doctype html><a href="https://a11yphant.com"></a>`);
    const check = new AxeLinkNameCheck(createMock<Logger>(), createMock<ConfigService>({ get: jest.fn(() => "url/") }), fetch);

    const submission = createSubmission({ id: "1" });
    const rule = createRule();

    const result = await check.run(submission, rule);

    expect(result.status).toEqual("failed");
  });
});
