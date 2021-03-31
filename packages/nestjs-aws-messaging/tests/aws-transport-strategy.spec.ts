import { SQSEvent, SQSRecord, SQSRecordAttributes } from "aws-lambda";
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

  it("can handle incoming events", async () => {
    const transport = new AwsTransportStrategy({ polling: false, queueUrl: "url", region: "eu-central-1", deleteHandled: false });
    const event: SQSEvent = {
      Records: [],
    };

    expect(transport.handleSQSEvent(event)).resolves.toBeUndefined();
  });

  it("throws an error if there is an error while handling an event", async () => {
    const transport = new AwsTransportStrategy({ polling: false, queueUrl: "url", region: "eu-central-1", deleteHandled: false });
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
            message: JSON.stringify("{}"),
            timestamp: new Date().toISOString(),
            messageAttributes: {
              type: { dataType: "String", value: "test-message" },
            },
          }),
          receiptHandle: "Hi",
        },
      ],
    };

    expect(transport.handleSQSEvent(event)).rejects.toBeTruthy();
  });

  it("can start listening when polling is disabled", () => {
    const callback = jest.fn();
    const receiveMessage = jest.fn();

    AWSMock.mock("SQS", "receiveMessage", receiveMessage);

    const transport = new AwsTransportStrategy({ polling: false, queueUrl: "url", region: "eu-central-1", deleteHandled: true });
    transport.listen(callback);

    expect(callback).toHaveBeenCalled();
    expect(receiveMessage).not.toHaveBeenCalled();
  });

  it("can start listening when polling is enabled", () => {
    const callback = jest.fn();
    const receiveMessage = jest.fn();

    AWSMock.mock("SQS", "receiveMessage", receiveMessage);

    const transport = new AwsTransportStrategy({ polling: true, queueUrl: "queue-url", region: "eu-central-1", deleteHandled: true });
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

    const event = { content: "hi" };
    const messageData: AWS.SQS.ReceiveMessageResult = {
      Messages: [
        {
          MessageId: "id",
          Body: JSON.stringify({
            Message: JSON.stringify(event),
            Timestamp: new Date().toISOString(),
            MessageAttributes: {
              type: { DataType: "String", Value: "test-message" },
            },
          }),
          ReceiptHandle: "Hi",
        },
      ],
    };

    const receiveMessage = jest.fn((params, cb) => {
      cb(null, messageData);
    });

    AWSMock.mock("SQS", "receiveMessage", receiveMessage);

    const transport = new AwsTransportStrategy({ polling: true, queueUrl: "queue-url", region: "eu-central-1", deleteHandled: true });
    transport.addHandler("test-message", messageHandler);
    transport.listen(callback);

    expect(callback).toHaveBeenCalled();
    transport.close();
    expect(receiveMessage).toHaveBeenCalledTimes(1);
    expect(messageHandler).toHaveBeenCalledWith(expect.objectContaining(event));
  });

  it("can close a connection when polling is disabled", () => {
    const transport = new AwsTransportStrategy({ polling: false, queueUrl: "url", region: "eu-central-1", deleteHandled: true });

    expect(() => transport.close()).not.toThrow();
  });

  it("forwards events to the correct message handler", async () => {
    const transport = new AwsTransportStrategy({ polling: false, queueUrl: "url", region: "eu-central-1", deleteHandled: true });
    const messageHandler = jest.fn().mockResolvedValue(null);
    const otherHandler = jest.fn().mockResolvedValue(null);
    transport.addHandler("test-message", messageHandler);
    transport.addHandler("other-message", otherHandler);

    await transport.handleSQSEvent({
      Records: [
        {
          messageId: "1",
          md5OfBody: "asdf",
          receiptHandle: "handle",
          body: JSON.stringify({
            Message: '{ "content": "hi" }',
            Timestamp: new Date().toISOString(),
            MessageAttributes: {
              type: { DataType: "String", Value: "test-message" },
            },
          }),
        } as SQSRecord,
      ],
    });

    expect(messageHandler).toHaveBeenCalled();
    expect(otherHandler).not.toHaveBeenCalled();
  });

  it("can handle unknown event types", async () => {
    const transport = new AwsTransportStrategy({ polling: false, queueUrl: "url", region: "eu-central-1", deleteHandled: true });

    const event = {
      Records: [
        {
          messageId: "1",
          receiptHandle: "handle",
          body: JSON.stringify({
            Message: '{ "content": "hi" }',
            Timestamp: new Date().toISOString(),
            MessageAttributes: {
              type: { DataType: "String", Value: "test-message" },
            },
          }),
        } as SQSRecord,
      ],
    };

    expect(transport.handleSQSEvent(event)).resolves.toBeUndefined();
  });

  it("deletes handled messages", async () => {
    const deleteMessage = jest.fn((_, cb) => cb(null));

    AWSMock.restore("SQS", "deleteMessage");
    AWSMock.mock("SQS", "deleteMessage", deleteMessage);

    const transport = new AwsTransportStrategy({ polling: false, queueUrl: "url", region: "eu-central-1", deleteHandled: true });
    const messageHandler = jest.fn().mockResolvedValue(null);
    transport.addHandler("test-message", messageHandler);

    await transport.handleSQSEvent({
      Records: [
        {
          messageId: "1",
          receiptHandle: "handle",
          body: JSON.stringify({
            Message: '{ "content": "hi" }',
            Timestamp: new Date().toISOString(),
            MessageAttributes: {
              type: { DataType: "String", Value: "test-message" },
            },
          }),
        } as SQSRecord,
      ],
    });

    expect(deleteMessage).toHaveBeenCalledWith(expect.objectContaining({ ReceiptHandle: "handle" }), expect.anything());
  });

  it("does not delete handled messages if its disabled", async () => {
    const deleteMessage = jest.fn((_, cb) => cb(null));

    AWSMock.restore("SQS", "deleteMessage");
    AWSMock.mock("SQS", "deleteMessage", deleteMessage);

    const transport = new AwsTransportStrategy({ polling: false, queueUrl: "url", region: "eu-central-1", deleteHandled: false });
    const messageHandler = jest.fn().mockResolvedValue(null);
    transport.addHandler("test-message", messageHandler);

    await transport.handleSQSEvent({
      Records: [
        {
          messageId: "1",
          receiptHandle: "handle",
          body: JSON.stringify({
            Message: '{ "content": "hi" }',
            Timestamp: new Date().toISOString(),
            MessageAttributes: {
              type: { DataType: "String", Value: "test-message" },
            },
          }),
        } as SQSRecord,
      ],
    });

    expect(deleteMessage).not.toHaveBeenCalled();
  });
});
