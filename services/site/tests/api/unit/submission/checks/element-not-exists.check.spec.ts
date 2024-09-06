import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { createRule, createSubmission } from "@tests/support/helpers";

import { ElementNotExists } from "@/submission/checks/base-checks";

describe("element-not-exists check", () => {
  const submission = createSubmission({
    id: "1",
  });

  const rule = createRule({
    key: "element-exists",
    options: {
      selector: "a",
    },
  });

  it("is successful if the selector was not found", async () => {
    submission.html = "<!doctype html><html></html>";

    const check = new ElementNotExists(createMock<Logger>());

    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "success");
  });

  it("fails if the selector was found", async () => {
    submission.html = `<!doctype html><html><a href=""></a></html>`;

    const check = new ElementNotExists(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "failed");
  });

  it("errors if the the selector is missing", async () => {
    submission.html = "";

    const rule = createRule({
      key: "element-exists",
      options: {},
    });

    const check = new ElementNotExists(createMock<Logger>());
    const result = await check.run(submission, rule);

    expect(result).toHaveProperty("id", rule.id);
    expect(result).toHaveProperty("status", "error");
  });
});
