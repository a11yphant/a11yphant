import { SubmissionCreatedEvent } from "@/submission-created-event.interface";

import { createSqsEvent, useApp, useSubmissionTopicSubscription } from "./helpers";

// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox().get("begin:https://url.com/", "<!doctype html>"));

const mockSubmissionCreatedEvent: SubmissionCreatedEvent = {
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
};

describe("integration tests", () => {
  const { getHandle } = useApp();

  it("can check a submission", async () => {
    const handle = getHandle();
    const result = await handle(createSqsEvent("submission.created", mockSubmissionCreatedEvent));
    expect(result).toBeUndefined();
  });

  it("publishes the check result", async () => {
    const handle = getHandle();
    const onSqsMessage = jest.fn();
    useSubmissionTopicSubscription(onSqsMessage);

    await handle(createSqsEvent("submission.created", mockSubmissionCreatedEvent));

    // wait for localstack to receive the message
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(onSqsMessage).toHaveBeenCalledTimes(1);
  });
});
