/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { createRule, createSubmission } from "@tests/support/helpers";

import { AxeCheck } from "@/submission/checks/base-checks";

describe("axe check", () => {
  const AxeLinkNameCheck = AxeCheck("link-name");
  const submission = createSubmission();
  const rule = createRule();

  it("returns a successful result when the check was successful", async () => {
    submission.html = `<!doctype html><a href="https://a11yphant.com">Go to a11yphant.com</a>`;
    const check = new AxeLinkNameCheck(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result.status).toEqual("success");
  });

  it("returns a failure result when the check was not successful", async () => {
    submission.html = `<!doctype html><a href="https://a11yphant.com"></a>`;
    const check = new AxeLinkNameCheck(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result.status).toEqual("failed");
  });
});
