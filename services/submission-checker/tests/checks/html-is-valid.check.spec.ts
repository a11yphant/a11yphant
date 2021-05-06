import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fetchMock from "fetch-mock-jest";
import nodeFetch from "node-fetch";

import { HtmlIsValidCheck } from "../../src/checks/html-is-valid.check";

describe("html-is-valid check", () => {
  it("can check a submission", async () => {
    const fetch = fetchMock
      .sandbox()
      .get("begin:https://url.com/", "some-html")
      .post("begin:https://validator.w3.org", { messages: [{ type: "info" }] });

    const check = new HtmlIsValidCheck(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "https://url.com/") }),
      (fetch as unknown) as typeof nodeFetch,
    );

    const result = await check.run(
      {
        id: "some-id",
        css: "",
        html: "",
        js: "",
      },
      { id: "asdf", key: "html-is-valid", options: {} },
    );

    expect(result).toHaveProperty("id", "asdf");
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the result contains errors", async () => {
    const fetch = fetchMock
      .sandbox()
      .get("begin:https://url.com/", "some-html")
      .post("begin:https://validator.w3.org", { messages: [{ type: "error" }] });

    const check = new HtmlIsValidCheck(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "https://url.com/") }),
      (fetch as unknown) as typeof nodeFetch,
    );

    const result = await check.run(
      {
        id: "some-id",
        css: "",
        html: "",
        js: "",
      },
      { id: "asdf", key: "html-is-valid", options: {} },
    );

    expect(result).toHaveProperty("id", "asdf");
    expect(result).toHaveProperty("status", "failed");
  });
});
