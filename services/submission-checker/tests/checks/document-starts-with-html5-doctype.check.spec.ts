import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fetchMock from "fetch-mock-jest";
import nodeFetch from "node-fetch";

import { DocumentStartsWithHtml5Doctype } from "../../src/checks/document-starts-with-html5-doctype.check";

describe("document-starts-with-html5-doctype check", () => {
  it("returns success for a document starting with a doctype", async () => {
    const fetch = fetchMock.sandbox().get("begin:https://url.com/", "<!doctype html>");

    const check = new DocumentStartsWithHtml5Doctype(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "https://url.com/") }),
      fetch as unknown as typeof nodeFetch,
    );

    const result = await check.run(
      {
        id: "some-id",
        css: "",
        html: "",
        js: "",
      },
      { id: "asdf", key: "document-starts-with-html5-doctype", options: {} },
    );

    expect(result).toHaveProperty("id", "asdf");
    expect(result).toHaveProperty("status", "success");
  });

  it("returns success for a document starting with whitespace followed by a doctype", async () => {
    const fetch = fetchMock.sandbox().get("begin:https://url.com/", "   \n\n  <!doctype html>");

    const check = new DocumentStartsWithHtml5Doctype(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "https://url.com/") }),
      fetch as unknown as typeof nodeFetch,
    );

    const result = await check.run(
      {
        id: "some-id",
        css: "",
        html: "",
        js: "",
      },
      { id: "asdf", key: "document-starts-with-html5-doctype", options: {} },
    );

    expect(result).toHaveProperty("id", "asdf");
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if there is no doctype", async () => {
    const fetch = fetchMock.sandbox().get("begin:https://url.com/", "no-doctype");

    const check = new DocumentStartsWithHtml5Doctype(
      createMock<Logger>(),
      createMock<ConfigService>({ get: jest.fn(() => "https://url.com/") }),
      fetch as unknown as typeof nodeFetch,
    );

    const result = await check.run(
      {
        id: "some-id",
        css: "",
        html: "",
        js: "",
      },
      { id: "asdf", key: "document-starts-with-html5-doctype", options: {} },
    );

    expect(result).toHaveProperty("id", "asdf");
    expect(result).toHaveProperty("status", "failed");
  });
});
