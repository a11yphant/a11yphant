import { INestMicroservice } from "@nestjs/common";
import { SQSEvent, SQSRecordAttributes } from "aws-lambda";
import AWS from "aws-sdk";

const SUBMISSION_TOPIC_NAME = "default-submission-topic";
const SUBMISSION_TOPIC_ARN = `arn:aws:sns:us-east-1:000000000000:${SUBMISSION_TOPIC_NAME}`;

const env = {
  IGNORE_ENV_FILE: "true",
  SUBMISSION_CHECKER_MESSAGING_TOPICS: `submission=${SUBMISSION_TOPIC_ARN}`,
  AWS_ACCESS_KEY_ID: "mock_access_key",
  AWS_SECRET_ACCESS_KEY: "mock_secret_key",
  SUBMISSION_CHECKER_MESSAGING_SNS_ENDPOINT: "http://localhost:4566",
  SUBMISSION_CHECKER_RENDERER_BASE_URL: "https://url.com/render/",
  SUBMISSION_CHECKER_DISABLE_LOGGER: "1",
};

function setUpEnv(): void {
  Object.keys(env).forEach((key) => {
    process.env[key] = env[key];
  });
}

function resetEnv(): void {
  Object.keys(env).forEach((key) => {
    delete process.env[key];
  });
}

type HandleFunction = (event: SQSEvent) => Promise<void>;
interface UseAppReturnType {
  getApp: () => INestMicroservice;
  getHandle: () => HandleFunction;
}

export function useApp(): UseAppReturnType {
  let app: INestMicroservice;
  let handle: HandleFunction;

  function getApp(): INestMicroservice {
    return app;
  }

  function getHandle(): HandleFunction {
    return handle;
  }

  beforeEach(async () => {
    setUpEnv();
    const { getApp, handle: handleFunction } = await import("@/main");
    app = await getApp();
    handle = handleFunction;
  });

  afterEach(async () => {
    resetEnv();
    await app.close();
  });

  return {
    getApp,
    getHandle,
  };
}

export function useSubmissionTopicSubscription(callback: () => {}): void {
  const sns = new AWS.SNS({ endpoint: "http://localhost:4566" });
  sns.subscribe(
    {
      TopicArn: SUBMISSION_TOPIC_ARN,
      Protocol: "sqs",
    },
    callback,
  );
}

export function createSqsEvent(eventName: string, payload: Record<string, any>): SQSEvent {
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
          Message: JSON.stringify(payload),
          Timestamp: new Date().toISOString(),
          MessageAttributes: {
            type: { DataType: "String", Value: eventName },
          },
        }),
        receiptHandle: "Hi",
      },
    ],
  };

  return event;
}
