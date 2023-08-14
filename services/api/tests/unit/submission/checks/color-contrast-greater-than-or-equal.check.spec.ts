import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { createRule, createSubmission } from "@tests/support/helpers";

import { ColorContrastGreaterThanOrEqual } from "@/submission/checks/base-checks";

describe("color-contrast-greater-than-or-equal", () => {
  const submission = createSubmission({
    html: "<html><button></button></html>",
  });

  const rule = createRule({
    key: "color-contrast-greater-than-or-equal",
    options: {
      selector: "button",
      minContrastValue: "4.5",
      property1: "color",
      property2: "background-color",
    },
  });

  it("is successful if the background is black and the text is white", async () => {
    submission.css = "button { background-color: black; color: white; }";
    const check = new ColorContrastGreaterThanOrEqual(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("is successful if the colors are specified in hex code", async () => {
    submission.css = "button { background-color: #000; color: #fff; }";
    const check = new ColorContrastGreaterThanOrEqual(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("is successful if the colors are specified in rgb()", async () => {
    submission.css = "button { background-color: rgb(0,0,0); color: rgb(255,255,255); }";
    const check = new ColorContrastGreaterThanOrEqual(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("is successful if the background is #6161FF and the text is white (contrast ratio = 4.5)", async () => {
    submission.css = "button { background-color: #6161FF; color: white; }";
    const check = new ColorContrastGreaterThanOrEqual(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the background is white and the text is white", async () => {
    submission.css = "button { background-color: white; color: white; }";
    const check = new ColorContrastGreaterThanOrEqual(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("fails if the background is #6162FF and the text is white (contrast ratio = 4.46)", async () => {
    submission.css = "button { background-color: #6162FF; color: white; }";
    const check = new ColorContrastGreaterThanOrEqual(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the background color has an invalid value", async () => {
    submission.css = "button { background-color: invalid-color; color: white; }";
    const check = new ColorContrastGreaterThanOrEqual(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the text color has an invalid value", async () => {
    submission.css = "button { background-color: black; color: invalid-color; }";
    const check = new ColorContrastGreaterThanOrEqual(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the selector is missing", async () => {
    const rule = createRule({
      key: "color-contrast-greater-than-or-equal",
      options: {
        minContrastValue: "4.5",
        property1: "color",
        property2: "background-color",
      },
    });

    const check = new ColorContrastGreaterThanOrEqual(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the minContrastValue is missing", async () => {
    const rule = createRule({
      key: "color-contrast-greater-than-or-equal",
      options: {
        selector: "button",
        property1: "color",
        property2: "background-color",
      },
    });

    const check = new ColorContrastGreaterThanOrEqual(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if property1 is missing", async () => {
    const rule = createRule({
      key: "color-contrast-greater-than-or-equal",
      options: {
        selector: "button",
        minContrastValue: "4.5",
        property2: "background-color",
      },
    });

    const check = new ColorContrastGreaterThanOrEqual(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if property2 is missing", async () => {
    const rule = createRule({
      key: "color-contrast-greater-than-or-equal",
      options: {
        selector: "button",
        minContrastValue: "4.5",
        property1: "color",
      },
    });

    const check = new ColorContrastGreaterThanOrEqual(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  // it("errors if the language is not specified", async () => {
  //   submission.html = `<!doctype html><html></html>`;
  //   const check = new DocumentLanguageIsSpecified(createMock<Logger>());
  //
  //   const result = await check.run(submission, rule);
  //
  //   expect(result).toHaveProperty("id", rule.id);
  //   expect(result).toHaveProperty("status", "failed");
  // });
  //
  // it("errors if the language is missing on the rule", async () => {
  //   const rule = createRule({ key: "document-language-is-specified", options: {} });
  //   submission.html = `<!doctype html><html lang="en"></html>`;
  //   const check = new DocumentLanguageIsSpecified(createMock<Logger>());
  //
  //   const result = await check.run(submission, rule);
  //
  //   expect(result).toHaveProperty("id", rule.id);
  //   expect(result).toHaveProperty("status", "error");
  // });
});
