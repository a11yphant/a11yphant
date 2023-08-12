import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { createRule, createSubmission } from "@tests/support/helpers";

import { ElementHasCssPropertyValue } from "@/submission/checks/base-checks";

describe("element-has-css-property-value", () => {
  const submission = createSubmission();
  const rule = createRule({
    key: "element-has-css-property-value",
    options: {
      selector: "h1",
      property: "color",
      value: "green",
    },
  });

  it("is successful if the property is correct", async () => {
    submission.html = "<html><h1></h1></html>";
    submission.css = "h1 { color:  green; }";

    const check = new ElementHasCssPropertyValue(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the selector was not found", async () => {
    submission.html = "<html></html>";
    submission.css = "h1 { color:  green; }";

    const check = new ElementHasCssPropertyValue(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("fails if the property was not found", async () => {
    submission.html = "<html><h1></h1></html>";
    submission.css = "p { color:  green; }";

    const check = new ElementHasCssPropertyValue(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("fails if the value is not correct", async () => {
    submission.html = "<html><h1></h1></html>";
    submission.css = "h1 { color:  blue; }";

    const check = new ElementHasCssPropertyValue(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the selector is missing", async () => {
    const rule = createRule({
      key: "element-has-css-property-value",
      options: {
        property: "color",
        value: "green",
      },
    });

    const check = new ElementHasCssPropertyValue(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the property is missing", async () => {
    const rule = createRule({
      key: "element-has-css-property-value",
      options: {
        selector: "h1",
        value: "green",
      },
    });

    const check = new ElementHasCssPropertyValue(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });

  it("errors if the value is missing", async () => {
    const rule = createRule({
      key: "element-has-css-property-value",
      options: {
        selector: "h1",
        property: "color",
      },
    });

    const check = new ElementHasCssPropertyValue(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
