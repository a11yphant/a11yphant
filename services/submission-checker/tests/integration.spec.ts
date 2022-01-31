import { INestMicroservice } from "@nestjs/common";
import { SQSEvent, SQSRecordAttributes } from "aws-lambda";
import AWS, { SNS } from "aws-sdk";

import { SubmissionCreatedEvent } from "@/submission-created-event.interface";

// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox().get("begin:https://url.com/", "<!doctype html>"));

const submission: SubmissionCreatedEvent = {
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

const event: SQSEvent = {
  Records: [
    {
      messageId: "id",
      md5OfBody: "234",
      messageAttributes: {},
      attributes: {} as SQSRecordAttributes,
      eventSource: "source",
      eventSourceARN: "arn",
      awsRegion: "eu-central-1",
      body: JSON.stringify({
        Message: JSON.stringify(submission),
        Timestamp: new Date().toISOString(),
        MessageAttributes: {
          type: { DataType: "String", Value: "submission.created" },
        },
      }),
      receiptHandle: "Hi",
    },
  ],
};

describe("integration tests", () => {
  let app: INestMicroservice;
  let handle;
  let sns: SNS;

  beforeEach(async () => {
    process.env.IGNORE_ENV_FILE = "true";
    process.env.SUBMISSION_CHECKER_MESSAGING_TOPICS = "submission=arn:aws:sns:us-east-1:000000000000:default-submission-topic";
    process.env.AWS_ACCESS_KEY_ID = "mock_access_key";
    process.env.AWS_SECRET_ACCESS_KEY = "mock_secret_key";
    process.env.SUBMISSION_CHECKER_MESSAGING_SNS_ENDPOINT = "http://localhost:4566";
    process.env.SUBMISSION_CHECKER_RENDERER_BASE_URL = "https://url.com/render/";
    process.env.SUBMISSION_CHECKER_DISABLE_LOGGER = "1";
    const { getApp, handle: handleFunction } = await import("@/main");
    app = await getApp();
    handle = handleFunction;

    sns = new AWS.SNS({ endpoint: "http://localhost:4566" });
    await sns.createTopic({ Name: "default-submission-topic" }).promise();
  });

  afterEach(async () => {
    process.env.IGNORE_ENV_FILE = undefined;
    process.env.SUBMISSION_CHECKER_MESSAGING_TOPICS = undefined;
    process.env.AWS_ACCESS_KEY_ID = undefined;
    process.env.AWS_SECRET_ACCESS_KEY = undefined;
    process.env.SUBMISSION_CHECKER_MESSAGING_SNS_ENDPOINT = undefined;
    process.env.SUBMISSION_CHECKER_RENDERER_BASE_URL = "http://host.docker.internal:3000/render/";

    await app.close();
  });

  it("can check a submission", async () => {
    const result = await handle(event);
    expect(result).toBeUndefined();
  });

  it("publishes the check result", async () => {
    const onSqsMessage = jest.fn();
    sns.subscribe({ TopicArn: "arn:aws:sns:us-east-1:000000000000:default-submission-topic", Protocol: "SQS" }, onSqsMessage);

    await handle(event);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(onSqsMessage).toHaveBeenCalledTimes(1);
  });
});
