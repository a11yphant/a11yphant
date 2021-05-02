import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { SubmissionController } from "../../src/submission/submission.controller";
import { SubmissionCheckCompletedEvent } from "../../src/submission/submission-check-completed-event.interface";

describe("submission controller", () => {
  it("can handle a submission.check-completed event", () => {
    const controller = new SubmissionController(createMock<Logger>());

    const event: SubmissionCheckCompletedEvent = {
      submissionId: "submission-id",
      result: {
        ruleCheckResults: [],
      },
    };

    expect(controller.handleSubmissionEvent(event)).resolves.toBeFalsy();
  });
});
