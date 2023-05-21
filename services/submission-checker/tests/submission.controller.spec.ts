import { createMock } from "@golevelup/nestjs-testing";
import { Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { CheckSubmissionService } from "@/check-submission.service";
import { SubmissionController } from "@/submission.controller";
import { SubmissionCreatedEvent } from "@/submission-created-event.interface";

describe("submission controller", () => {
  it("it handles submission.created events", async () => {
    const emit = jest.fn().mockReturnValue({ toPromise: jest.fn().mockResolvedValue(null) });
    const controller = new SubmissionController(
      createMock<Logger>(),
      createMock<ClientProxy>({ emit }),
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

    await controller.handleSubmissionEvent(submissionCreatedEvent);

    expect(emit).toHaveBeenCalledWith("submission.check-completed", expect.anything());
  });
});
