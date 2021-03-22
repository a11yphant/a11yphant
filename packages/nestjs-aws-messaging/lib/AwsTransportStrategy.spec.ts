import { SQSEvent, SQSRecord } from "aws-lambda";

import { AwsTransportStrategy } from "./AwsTransportStrategy";

describe("AWS Transport Strategy", () => {
  it("can handle incomming events", async () => {
    const transport = new AwsTransportStrategy();
    const event: SQSEvent = {
      Records: [],
    };

    expect(transport.handleSQSEvent(event)).resolves.toBeUndefined();
  });

  it("can start listening", () => {
    const transport = new AwsTransportStrategy();
    const callback = jest.fn();

    transport.listen(callback);

    expect(callback).toHaveBeenCalled();
  });

  it("can close a connection", () => {
    const transport = new AwsTransportStrategy();

    expect(() => transport.close()).not.toThrow();
  });

  it("forwards events to the correct message handler", () => {
    const transport = new AwsTransportStrategy();
    const messageHandler = jest.fn();
    const otherHandler = jest.fn();
    transport.addHandler("test-message", messageHandler);
    transport.addHandler("other-message", otherHandler);

    transport.handleSQSEvent({
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
          body: '{ content: "hi" }',
        } as SQSRecord,
      ],
    });

    expect(messageHandler).toHaveBeenCalled();
    expect(otherHandler).not.toHaveBeenCalled();
  });
});
