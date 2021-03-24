import { CustomTransportStrategy, Server } from "@nestjs/microservices";
import { SQSEvent, SQSRecord } from "aws-lambda";
import AWS from "aws-sdk";

import { AwsTransportStrategyOptions } from "./aws-transport-strategy-options.interface";

export class AwsTransportStrategy extends Server implements CustomTransportStrategy {
  private continuePolling = false;
  private sqs: AWS.SQS;

  constructor(private options: AwsTransportStrategyOptions) {
    super();
    AWS.config.update({ region: this.options.region });
    this.sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
  }

  public listen(callback: () => void): void {
    if (this.options.polling) {
      this.startPollingSQS();
    }
    callback();
  }

  public close(): void {
    this.continuePolling = false;
  }

  async handleSQSEvent(event: SQSEvent): Promise<void> {
    for (const message of event.Records) {
      await this.processEvent(message);
    }
  }

  private async startPollingSQS(): Promise<void> {
    this.continuePolling = true;

    while (this.continuePolling) {
      try {
        await this.pollSQS();
      } catch (e) {
        this.logger.error(e.message, null, AwsTransportStrategy.name);
      }
    }
  }

  private async pollSQS(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sqs.receiveMessage(
        {
          QueueUrl: this.options.queueUrl,
          MessageAttributeNames: ["All"],
        },
        async (error, data) => {
          if (error) {
            reject(new Error(`Receiving messages failed: ${error.message}`));
            return;
          }

          if (!data.Messages) {
            resolve();
            return;
          }

          this.logger.log(`Received ${data.Messages.length} messages`, AwsTransportStrategy.name);

          for (const message of data.Messages) {
            await this.processEvent(message);
          }

          resolve();
        },
      );
    });
  }

  private async processEvent(message: SQSRecord | AWS.SQS.Message): Promise<void> {
    const type = this.getMessageType(message);
    const handler = this.getHandlerByPattern(type);

    if (!handler) {
      return;
    }
    const messageId = (message as SQSRecord).messageId || (message as AWS.SQS.Message).MessageId;
    const body = (message as SQSRecord).body || (message as AWS.SQS.Message).Body;
    try {
      await handler(JSON.parse(body));
    } catch (error) {
      this.logger.error(`Could not process event ${messageId}: ${error.message}`, null, AwsTransportStrategy.name);
      return;
    }

    try {
      await this.deleteMessageFromQueue(message);
    } catch (error) {
      this.logger.error(`Could not delete message ${messageId} from the queue: ${error.message}`, null, AwsTransportStrategy.name);
      return;
    }
  }

  private async deleteMessageFromQueue(message): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sqs.deleteMessage(
        {
          QueueUrl: this.options.queueUrl,
          ReceiptHandle: (message as SQSRecord).receiptHandle || (message as AWS.SQS.Message).ReceiptHandle,
        },
        (error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        },
      );
    });
  }

  private getMessageType(message: SQSRecord | AWS.SQS.Message): string {
    return (message as SQSRecord)?.messageAttributes?.type?.stringValue || (message as AWS.SQS.Message)?.MessageAttributes?.type?.StringValue;
  }
}
