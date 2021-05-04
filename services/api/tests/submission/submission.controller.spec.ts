import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { ResultService } from "src/submission/result.service";

import { RequirementResultService } from "../../src/submission/requirement-result.service";
import { SubmissionController } from "../../src/submission/submission.controller";
import { SubmissionCheckCompletedEvent } from "../../src/submission/submission-check-completed-event.interface";

describe("submission controller", () => {
  it("can handle a submission.check-completed event", () => {
    const controller = new SubmissionController(createMock<Logger>(), createMock<ResultService>(), createMock<RequirementResultService>());

    const event: SubmissionCheckCompletedEvent = {
      submissionId: "submission-id",
      result: {
        ruleCheckResults: [],
      },
    };

    expect(controller.handleSubmissionEvent(event)).resolves.toBeFalsy();
  });
});
