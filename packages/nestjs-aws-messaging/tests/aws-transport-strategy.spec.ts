import { SQSEvent, SQSRecord } from "aws-lambda";
import AWS from "aws-sdk";
import AWSMock from "aws-sdk-mock";

import { AwsTransportStrategy } from "../lib/aws-transport-strategy";

describe("AWS Transport Strategy", () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock(
      "SQS",
      "deleteMessage",
      jest.fn((_, cb) => cb(null)),
    );
  });

  afterEach(() => {
    AWSMock.restore();
  });

  it("can handle incomming events", async () => {
    const transport = new AwsTransportStrategy({ polling: false, queueUrl: "url", region: "eu-central-1" });
    const event: SQSEvent = {
      Records: [],
    };

    expect(transport.handleSQSEvent(event)).resolves.toBeUndefined();
  });

  it("can start listening when polling is disabled", () => {
    const callback = jest.fn();
    const receiveMessage = jest.fn();

    AWSMock.mock("SQS", "receiveMessage", receiveMessage);

    const transport = new AwsTransportStrategy({ polling: false, queueUrl: "url", region: "eu-central-1" });
    transport.listen(callback);

    expect(callback).toHaveBeenCalled();
    expect(receiveMessage).not.toHaveBeenCalled();
  });

  it("can start listening when polling is enabled", () => {
    const callback = jest.fn();
    const receiveMessage = jest.fn();

    AWSMock.mock("SQS", "receiveMessage", receiveMessage);

    const transport = new AwsTransportStrategy({ polling: true, queueUrl: "queue-url", region: "eu-central-1" });
    transport.listen(callback);

    expect(callback).toHaveBeenCalled();
    expect(receiveMessage).toHaveBeenCalledWith(
      expect.objectContaining({ QueueUrl: "queue-url", MessageAttributeNames: ["All"] }),
      expect.anything(),
    );
    transport.close();
  });

  it("processes the polled messages", () => {
    const callback = jest.fn();
    const messageHandler = jest.fn().mockResolvedValue(null);

    const messageData: AWS.SQS.ReceiveMessageResult = {
      Messages: [
        {
          MessageId: "id",
          Body: '{ "content": "hi" }',
          ReceiptHandle: "Hi",
          MessageAttributes: {
            type: { DataType: "String", StringValue: "test-message" },
          },
        },
      ],
    };

    const receiveMessage = jest.fn((params, cb) => {
      cb(null, messageData);
    });

    AWSMock.mock("SQS", "receiveMessage", receiveMessage);

    const transport = new AwsTransportStrategy({ polling: true, queueUrl: "queue-url", region: "eu-central-1" });
    transport.addHandler("test-message", messageHandler);
    transport.listen(callback);

    expect(receiveMessage).toHaveBeenCalledTimes(1);
    expect(messageHandler).toHaveBeenCalledWith(expect.objectContaining(JSON.parse(messageData.Messages[0].Body)));
    transport.close();
  });

  it("can close a connection when polling is disabled", () => {
    const transport = new AwsTransportStrategy({ polling: false, queueUrl: "url", region: "eu-central-1" });

    expect(() => transport.close()).not.toThrow();
  });

  it("forwards events to the correct message handler", async () => {
    const transport = new AwsTransportStrategy({ polling: false, queueUrl: "url", region: "eu-central-1" });
    const messageHandler = jest.fn().mockResolvedValue(null);
    const otherHandler = jest.fn().mockResolvedValue(null);
    transport.addHandler("test-message", messageHandler);
    transport.addHandler("other-message", otherHandler);

    await transport.handleSQSEvent({
      Records: [
        {
          messageId: "1",
          awsRegion: "eu-central-1",
          eventSource: "a",
          eventSourceARN: "arn",
          md5OfBody: "asdf",
          attributes: { ApproximateFirstReceiveTimestamp: "timestamp", ApproximateReceiveCount: "1", SenderId: "23", SentTimestamp: "timestamp" },
          receiptHandle: "handle",
          messageAttributes: {
            type: { dataType: "String", stringValue: "test-message", binaryListValues: undefined, stringListValues: undefined },
          },
          body: '{ "content": "hi" }',
        } as SQSRecord,
      ],
    });

    expect(messageHandler).toHaveBeenCalled();
    expect(otherHandler).not.toHaveBeenCalled();
  });

  it("can handle unknown event types", async () => {
    const transport = new AwsTransportStrategy({ polling: false, queueUrl: "url", region: "eu-central-1" });

    const event = {
      Records: [
        {
          messageId: "1",
          awsRegion: "eu-central-1",
          eventSource: "a",
          eventSourceARN: "arn",
          md5OfBody: "asdf",
          attributes: { ApproximateFirstReceiveTimestamp: "timestamp", ApproximateReceiveCount: "1", SenderId: "23", SentTimestamp: "timestamp" },
          receiptHandle: "handle",
          messageAttributes: {
            type: { dataType: "String", stringValue: "unknown-message", binaryListValues: undefined, stringListValues: undefined },
          },
          body: '{ "content": "hi" }',
        } as SQSRecord,
      ],
    };

    expect(transport.handleSQSEvent(event)).resolves.toBeUndefined();
  });

  it("deletes handled messages", async () => {
    const deleteMessage = jest.fn((_, cb) => cb(null));

    AWSMock.restore("SQS", "deleteMessage");
    AWSMock.mock("SQS", "deleteMessage", deleteMessage);

    const transport = new AwsTransportStrategy({ polling: false, queueUrl: "url", region: "eu-central-1" });
    const messageHandler = jest.fn().mockResolvedValue(null);
    transport.addHandler("test-message", messageHandler);

    await transport.handleSQSEvent({
      Records: [
        {
          messageId: "1",
          awsRegion: "eu-central-1",
          eventSource: "a",
          eventSourceARN: "arn",
          md5OfBody: "asdf",
          attributes: { ApproximateFirstReceiveTimestamp: "timestamp", ApproximateReceiveCount: "1", SenderId: "23", SentTimestamp: "timestamp" },
          receiptHandle: "handle",
          messageAttributes: {
            type: { dataType: "String", stringValue: "test-message", binaryListValues: undefined, stringListValues: undefined },
          },
          body: '{ "content": "hi" }',
        } as SQSRecord,
      ],
    });

    expect(deleteMessage).toHaveBeenCalledWith(expect.objectContaining({ ReceiptHandle: "handle" }), expect.anything());
  });
});
