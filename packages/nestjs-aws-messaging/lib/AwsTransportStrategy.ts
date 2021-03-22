import { CustomTransportStrategy, Server } from "@nestjs/microservices";
import { SQSEvent, SQSRecord } from "aws-lambda";

export class AwsTransportStrategy extends Server implements CustomTransportStrategy {
  listen(callback: () => void): void {
    callback();
  }

  async handleSQSEvent(event: SQSEvent): Promise<void> {
    for (const message of event.Records) {
      const type = this.getMessageType(message);
      const handler = this.getHandlerByPattern(type);
      await handler(message);
    }
    return new Promise((resolve) => setImmediate(resolve));
  }

  close(): void {
    // we don't need to close anything, since we don't have a connection
  }

  private getMessageType(message: SQSRecord): string {
    return message.messageAttributes.type?.stringValue;
  }
}
