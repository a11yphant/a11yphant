/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { createRule, createSubmission } from "@tests/support/helpers";
import fetchMock from "fetch-mock-jest";
import nodeFetch from "node-fetch";

import { HtmlIsValid } from "@/submission/checks/base-checks";

describe("html-is-valid check", () => {
  const submission = createSubmission();
  const rule = createRule({ key: "html-is-valid" });

  it("can check a submission", async () => {
    const fetch = fetchMock
      .sandbox()
      .get("begin:https://url.com/", "some-html")
      .post("begin:https://validator.w3.org", { messages: [{ type: "info" }] });

    const check = new HtmlIsValid(createMock<Logger>(), fetch as unknown as typeof nodeFetch);

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the result contains errors", async () => {
    const fetch = fetchMock
      .sandbox()
      .get("begin:https://url.com/", "some-html")
      .post("begin:https://validator.w3.org", { messages: [{ type: "error" }] });

    const check = new HtmlIsValid(createMock<Logger>(), fetch as unknown as typeof nodeFetch);

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("returns an error if checking using the validator fails", async () => {
    const fetch = fetchMock
      .sandbox()
      .get("begin:https://url.com/", "some-html")
      .post("begin:https://validator.w3.org", { throws: new Error("did not work") });

    const check = new HtmlIsValid(createMock<Logger>(), fetch as unknown as typeof nodeFetch);

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
