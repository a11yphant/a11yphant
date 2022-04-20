import { ReadPacket } from "@nestjs/microservices";

import { SubmissionCreatedEvent } from "@/submission-created-event.interface";

import { publishMessageForSubmissionChecker, useApiQueueSubscription, useApp } from "./helpers";

// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox().get("begin:https://url.com/", "<!doctype html>"));

const mockSubmissionCreatedEvent: ReadPacket<SubmissionCreatedEvent> = {
  pattern: "submission.created",
  data: {
    submission: {
      id: "id",
      css: "css",
      html: "html",
      js: "js",
    },
    rules: [
      {
        id: "id",
        key: "document-starts-with-html5-doctype",
        options: {},
      },
    ],
  },
};

describe("integration tests", () => {
  useApp();

  it("publishes the check result", async () => {
    const onMessage = jest.fn();
    const { close } = await useApiQueueSubscription(onMessage);
    await publishMessageForSubmissionChecker(mockSubmissionCreatedEvent);

    // wait for localstack to receive the message
    await new Promise((resolve) => setTimeout(resolve, 1000));
    close();
    expect(onMessage).toHaveBeenCalledTimes(1);
  });
});
