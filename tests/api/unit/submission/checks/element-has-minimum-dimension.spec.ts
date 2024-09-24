/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { createRule, createSubmission } from "@tests/support/helpers";

import { ElementHasMinimumDimension } from "@/submission/checks/base-checks/element-has-minimum-dimension";

describe("element-has-minimum-dimension", () => {
  const submission = createSubmission({
    html: "<html><button></button></html>",
    css: "",
  });

  const widthHeightSubmission = createSubmission({
    html: "<html><button></button></html>",
    css: "button { width: 20px; height: 20px; padding: 0; }",
  });

  const minWidthMinHeightSubmission = createSubmission({
    html: "<html><button></button></html>",
    css: "button { min-width: 20px; min-height: 20px; padding: 0; }",
  });

  // width + height

  it("is successful if the width is bigger than minValue", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "width",
        minValue: "19px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(widthHeightSubmission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("is successful if the width is equal to minValue", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "width",
        minValue: "20px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(widthHeightSubmission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the width is smaller than minValue", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "width",
        minValue: "21px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(widthHeightSubmission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("is successful if the height is bigger than minValue", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "height",
        minValue: "19px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(widthHeightSubmission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("is successful if the height is equal to minValue", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "height",
        minValue: "20px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(widthHeightSubmission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the height is smaller than minValue", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "height",
        minValue: "21px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(widthHeightSubmission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  // width + height

  // minWidth + minHeight

  it("is successful if the min-width is bigger than minValue", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "width",
        minValue: "19px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(minWidthMinHeightSubmission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("is successful if the min-width is equal to minValue", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "width",
        minValue: "20px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(minWidthMinHeightSubmission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the min-width is smaller than minValue", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "width",
        minValue: "21px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(minWidthMinHeightSubmission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("is successful if the min-height is bigger than minValue", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "height",
        minValue: "19px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(minWidthMinHeightSubmission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("is successful if the min-height is equal to minValue", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "height",
        minValue: "20px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(minWidthMinHeightSubmission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the min-height is smaller than minValue", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "height",
        minValue: "21px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(minWidthMinHeightSubmission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  // minWidth + minHeight

  // padding + text

  it("is successful if padding-left, padding-right and the text width are bigger than minValue", async () => {
    const submission = createSubmission({
      html: "<html><button>aa</button></html>",
      css: "button { padding: 2px; }",
    });

    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "width",
        minValue: "19px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("is successful if padding-left, padding-right and the text width are equal to minValue", async () => {
    const submission = createSubmission({
      html: "<html><button>aa</button></html>",
      css: "button { padding: 2px; }",
    });

    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "width",
        minValue: "20px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if padding-left, padding-right and the text width are smaller than minValue", async () => {
    const submission = createSubmission({
      html: "<html><button>aa</button></html>",
      css: "button { padding: 2px; }",
    });

    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "width",
        minValue: "21px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("is successful if padding-top, padding-bottom and the line-height are bigger than minValue", async () => {
    const submission = createSubmission({
      html: "<html><button></button></html>",
      css: "button { padding: 5px; line-height: 10px }",
    });

    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "height",
        minValue: "19px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("is successful if padding-top, padding-bottom and the line-height are equal than minValue", async () => {
    const submission = createSubmission({
      html: "<html><button></button></html>",
      css: "button { padding: 5px; line-height: 10px }",
    });

    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "height",
        minValue: "20px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if padding-top, padding-bottom and the line-height are smaller than minValue", async () => {
    const submission = createSubmission({
      html: "<html><button></button></html>",
      css: "button { padding: 5px; line-height: 10px }",
    });

    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "height",
        minValue: "21px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("is successful if padding-top, padding-bottom and the font-size are bigger than minValue", async () => {
    const submission = createSubmission({
      html: "<html><button></button></html>",
      css: "button { padding: 5px; font-size: 10px }",
    });

    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "height",
        minValue: "19px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("is successful if padding-top, padding-bottom and the font-size are equal to minValue", async () => {
    const submission = createSubmission({
      html: "<html><button></button></html>",
      css: "button { padding: 5px; font-size: 10px }",
    });

    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "height",
        minValue: "20px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if padding-top, padding-bottom and the font-size are smaller than minValue", async () => {
    const submission = createSubmission({
      html: "<html><button></button></html>",
      css: "button { padding: 5px; font-size: 10px }",
    });

    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "height",
        minValue: "21px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("falls back to font-size = 16px if no line-height or font-size are set", async () => {
    const submission = createSubmission({
      html: "<html><button></button></html>",
      css: "button { padding: 2px; }",
    });

    const equalRule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "height",
        minValue: "20px",
      },
    });

    const smallerRule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "height",
        minValue: "21px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const successResult = await check.run(submission, equalRule);
    const failedResult = await check.run(submission, smallerRule);

    expect(successResult).toHaveProperty("id", equalRule.id);
    expect(successResult).toHaveProperty("status", "success");

    expect(failedResult).toHaveProperty("id", smallerRule.id);
    expect(failedResult).toHaveProperty("status", "failed");
  });

  // padding + text

  it("errors if minValue is not a valid number", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "width",
        minValue: "no number",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(widthHeightSubmission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if selector is missing", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        dimension: "width",
        minValue: "20px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if dimension is missing", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        minValue: "20px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if minValue is missing", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "width",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if dimension is not 'width' or 'height'", async () => {
    const rule = createRule({
      key: "element-has-minimum-dimension",
      options: {
        selector: "button",
        dimension: "abc",
        minValue: "20px",
      },
    });

    const check = new ElementHasMinimumDimension(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
