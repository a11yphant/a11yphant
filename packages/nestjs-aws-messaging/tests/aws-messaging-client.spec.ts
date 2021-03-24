import { ReadPacket } from "@nestjs/microservices";
import AWS from "aws-sdk";
import AWSMock from "aws-sdk-mock";

import { AwsMessagingClient } from "../lib/aws-messaging-client";

describe("AWS Messaging Client", () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore();
  });

  it("can create a connection", () => {
    const client = new AwsMessagingClient({
      topics: {},
      region: "eu-central-1",
    });

    expect(() => client.connect()).not.toThrow(expect.any(Error));
  });

  it("can close the connection", () => {
    const client = new AwsMessagingClient({
      topics: {},
      region: "eu-central-1",
    });

    expect(() => client.close()).not.toThrow(expect.any(Error));
  });

  it("cannot publish a message", () => {
    const client = new AwsMessagingClient({
      topics: {},
      region: "eu-central-1",
    });

    const packet: ReadPacket<string> = {
      pattern: "test",
      data: '{ "content": "hi" }',
    };

    expect(() => {
      client.publish(packet, jest.fn());
    }).toThrow(expect.any(Error));
  });

  it("can dispatch an event", async () => {
    const publish = jest.fn((message, cb) => {
      cb(null);
    });
    AWSMock.mock("SNS", "publish", publish);

    const data = {
      content: "hi",
    };
    const eventName = "submission.something-happened";

    const topics = { submission: "submission-topic-arn" };
    const client = new AwsMessagingClient({ topics, region: "eu-central-1" });

    const result = await client.dispatchEvent({
      pattern: eventName,
      data,
    });

    expect(result).toEqual(data);
    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({
        Message: JSON.stringify(data),
        MessageAttributes: {
          type: {
            DataType: "String",
            StringValue: eventName,
          },
        },
        TopicArn: topics.submission,
      }),
      expect.anything(),
    );
  });

  it("throws an exception if the topic does not exist", async () => {
    const publish = jest.fn((message, cb) => {
      cb(null);
    });
    AWSMock.mock("SNS", "publish", publish);

    const data = {
      content: "hi",
    };
    const eventName = "unknown-topic.something-happened";

    const topics = { submission: "submission-topic-arn" };
    const client = new AwsMessagingClient({ topics, region: "eu-central-1" });

    expect(
      client.dispatchEvent({
        pattern: eventName,
        data,
      }),
    ).rejects.toBeTruthy();
  });

  it("throws an exception if publishing the message to SNS failed", () => {
    const publish = jest.fn((message, cb) => {
      cb(new Error("don't know whats wrong"));
    });
    AWSMock.mock("SNS", "publish", publish);

    const data = {
      content: "hi",
    };
    const eventName = "unknown-topic.something-happened";

    const topics = { submission: "submission-topic-arn" };
    const client = new AwsMessagingClient({ topics, region: "eu-central-1" });

    expect(
      client.dispatchEvent({
        pattern: eventName,
        data,
      }),
    ).rejects.toBeTruthy();
  });
});
