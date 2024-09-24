/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { createRule, createSubmission } from "@tests/support/helpers";

import { ElementHasCssPropertyValueGreaterThan } from "@/submission/checks/base-checks";

describe("element-has-css-property-value", () => {
  const submission = createSubmission({
    html: "<html><h1></h1></html>",
    css: "h1 { font-size:  12px; }",
  });

  const rule = createRule({
    key: "element-has-css-property-value-greater-than",
    options: {
      selector: "h1",
      property: "font-size",
      value: "11px",
    },
  });

  const getCheck = (): ElementHasCssPropertyValueGreaterThan => new ElementHasCssPropertyValueGreaterThan(createMock<Logger>());

  it("is successful if the property is correct", async () => {
    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the selector was not found", async () => {
    const submission = createSubmission({
      html: "<html></html>",
      css: "h1 { font-size:  12px; }",
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("fails if the property was not found", async () => {
    const submission = createSubmission({
      html: "<html><h1></h1></html>",
      css: "h1 { height:  12px; }",
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });
  it("fails if the value is smaller", async () => {
    const submission = createSubmission({
      html: "<html><h1></h1></html>",
      css: "h1 { height:  10px; }",
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("fails if the value is equal", async () => {
    const submission = createSubmission({
      html: "<html><h1></h1></html>",
      css: "h1 { height:  11px; }",
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the value can not be parsed", async () => {
    const rule = createRule({
      key: "element-has-css-property-value-greater-than",
      options: {
        selector: "h1",
        property: "font-size",
        value: "string",
      },
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the selector is missing", async () => {
    const rule = createRule({
      key: "element-has-css-property-value-greater-than",
      options: {
        property: "font-size",
        value: "11px",
      },
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the property is missing", async () => {
    const rule = createRule({
      key: "element-has-css-property-value-greater-than",
      options: {
        selector: "h1",
        value: "11px",
      },
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the value is missing", async () => {
    const rule = createRule({
      key: "element-has-css-property-value-greater-than",
      options: {
        selector: "h1",
        property: "font-size",
      },
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
