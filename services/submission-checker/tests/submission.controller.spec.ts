import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CheckSubmissionService } from "src/check-submission.service";

import { SubmissionController } from "../src/submission.controller";
import { SubmissionCreatedEvent } from "../src/submission-created-event.interface";

describe("submission controller", () => {
  it("it handles submission.created events", () => {
    const controller = new SubmissionController(
      createMock<Logger>(),
      createMock<ClientProxy>({ emit: jest.fn().mockResolvedValue(null) }),
      createMock<CheckSubmissionService>({ check: jest.fn().mockResolvedValue({}) }),
    );
    const submissionCreatedEvent: SubmissionCreatedEvent = {
      submission: {
        id: "uuid",
        html: "html",
        css: "css",
        js: "js",
      },
      rules: [{ id: "rule-uuid", key: "test-key", options: {} }],
    };

    expect(() => controller.handleSubmissionEvent(submissionCreatedEvent)).not.toThrow();
  });
});
