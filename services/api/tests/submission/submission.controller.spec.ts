import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { ResultStatus } from "../../src/submission/models/result-status.enum";
import { RequirementResultService } from "../../src/submission/requirement-result.service";
import { ResultService } from "../../src/submission/result.service";
import { SubmissionController } from "../../src/submission/submission.controller";
import { SubmissionCheckCompletedEvent } from "../../src/submission/submission-check-completed-event.interface";
import { RequirementResultFactory } from "../factories/models/requirement-result.factory";
import { ResultFactory } from "../factories/models/result.factory";

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

  it("updates the submission status for successful results", async () => {
    const result = ResultFactory.build();
    const update = jest.fn().mockResolvedValue(ResultFactory.build());
    const controller = new SubmissionController(
      createMock<Logger>(),
      createMock<ResultService>({
        update,
        findOneForSubmission: jest.fn().mockResolvedValue(result),
      }),
      createMock<RequirementResultService>(),
    );

    const submissionId = "submission-id";
    const event: SubmissionCheckCompletedEvent = {
      submissionId,
      result: {
        ruleCheckResults: [],
      },
    };

    await controller.handleSubmissionEvent(event);

    expect(update).toHaveBeenCalledWith(result.id, { status: ResultStatus.SUCCESS });
  });

  it("updates the submission status for failed results", async () => {
    const result = ResultFactory.build();
    const update = jest.fn().mockResolvedValue(result);
    const controller = new SubmissionController(
      createMock<Logger>(),
      createMock<ResultService>({
        update,
        findOneForSubmission: jest.fn().mockResolvedValue(result),
      }),
      createMock<RequirementResultService>({
        create: jest.fn().mockResolvedValue(RequirementResultFactory.build()),
      }),
    );

    const event: SubmissionCheckCompletedEvent = {
      submissionId: "submission-id",
      result: {
        ruleCheckResults: [
          {
            id: "asdf",
            status: "failed",
          },
        ],
      },
    };

    await controller.handleSubmissionEvent(event);

    expect(update).toHaveBeenCalledWith(result.id, { status: ResultStatus.FAIL });
  });

  it("updates the submission status for error results", async () => {
    const result = ResultFactory.build();
    const update = jest.fn().mockResolvedValue(result);
    const controller = new SubmissionController(
      createMock<Logger>(),
      createMock<ResultService>({
        update,
        findOneForSubmission: jest.fn().mockResolvedValue(result),
      }),
      createMock<RequirementResultService>({
        create: jest.fn().mockResolvedValue(RequirementResultFactory.build()),
      }),
    );

    const event: SubmissionCheckCompletedEvent = {
      submissionId: "submission-id",
      result: {
        ruleCheckResults: [
          {
            id: "asdf",
            status: "error",
          },
        ],
      },
    };

    await controller.handleSubmissionEvent(event);

    expect(update).toHaveBeenCalledWith(result.id, { status: ResultStatus.ERROR });
  });
});
