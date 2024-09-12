/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { createRule, createSubmission } from "@tests/support/helpers";

import { MarginBetweenElementsGreaterThanOrEqual } from "@/submission/checks/base-checks/margin-between-elements-greater-than-or-equal.check";

describe("margin-between-elements-greater-than-or-equal", () => {
  const submission = createSubmission({
    html: "<html><button>One</button><button>Two</button></html>",
    css: "button { margin: 10px } button:nth-of-type(1) { margin-right: 10px } button:nth-of-type(2) { margin-left: 10px }",
  });

  const rule = createRule({
    key: "margin-between-elements-greater-than-or-equal",
    options: {
      selector1: "button:nth-of-type(1)",
      selector2: "button:nth-of-type(2)",
      value: "20px",
    },
  });

  const getCheck = (): MarginBetweenElementsGreaterThanOrEqual => new MarginBetweenElementsGreaterThanOrEqual(createMock<Logger>());

  it("fails if selector1 was not found", async () => {
    const submission = createSubmission({
      html: "<html></html>",
      css: "",
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("fails if selector2 was not found", async () => {
    const submission = createSubmission({
      html: "<html><button>One</button></html>",
      css: "h1 { font-size:  12px; }",
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("fails if combined margins are smaller than the value", async () => {
    const submission = createSubmission({
      html: "<html><button>One</button><button>Two</button></html>",
      css: "button:nth-of-type(1) { margin-right: 5px } button:nth-of-type(2) { margin-left: 5px }",
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("is successful if combined margins are equal to the value", async () => {
    const submission = createSubmission({
      html: "<html><button>One</button><button>Two</button></html>",
      css: "button:nth-of-type(1) { margin-right: 10px } button:nth-of-type(2) { margin-left: 10px }",
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("is successful if combined margins are greater than the value", async () => {
    const submission = createSubmission({
      html: "<html><button>One</button><button>Two</button></html>",
      css: "button:nth-of-type(1) { margin: 15px } button:nth-of-type(2) { margin-left: 15px }",
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("marginLeft and marginRight override margin", async () => {
    const submission = createSubmission({
      html: "<html><button>One</button><button>Two</button></html>",
      css: "button { margin: 15px } button:nth-of-type(1) { margin-right: 1px } button:nth-of-type(2) { margin-left: 1px }",
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the value cannot be parsed", async () => {
    const rule = createRule({
      key: "element-has-css-property-value-greater-than",
      options: {
        selector1: "button:nth-of-type(1)",
        selector2: "button:nth-of-type(2)",
        value: "string",
      },
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if selector1 is missing", async () => {
    const rule = createRule({
      key: "element-has-css-property-value-greater-than",
      options: {
        selector2: "button:nth-of-type(2)",
        value: "20px",
      },
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if selector2 is missing", async () => {
    const rule = createRule({
      key: "element-has-css-property-value-greater-than",
      options: {
        selector1: "button:nth-of-type(1)",
        value: "20px",
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
        selector1: "button:nth-of-type(1)",
        selector2: "button:nth-of-type(2)",
      },
    });

    const check = getCheck();
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
