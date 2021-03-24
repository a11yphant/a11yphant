import { ClientProxy, ReadPacket, WritePacket } from "@nestjs/microservices";
import AWS from "aws-sdk";

import { AwsMessagingClientOptions } from "./aws-messaging-client-options";

export class AwsMessagingClient extends ClientProxy {
  private sns: AWS.SNS;
  constructor(private options: AwsMessagingClientOptions) {
    super();
    AWS.config.update({ region: this.options.region });
    this.sns = new AWS.SNS({ apiVersion: "2010-03-31" });
  }

  async connect(): Promise<void> {
    // there is no need to connect to something
  }

  async close(): Promise<void> {
    // there is no need to disconnect from something
  }

  async dispatchEvent<T = any>({ pattern, data }: ReadPacket<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const topic = this.getTopicFromPattern(pattern);
      const arn = this.options.topics[topic];

      if (!arn) {
        reject(new Error(`Cannot find arn for topic ${topic}. Make sure that the arn is included in the configuration`));
      }

      const message: AWS.SNS.PublishInput = {
        Message: JSON.stringify(data),
        MessageAttributes: {
          type: {
            DataType: "String",
            StringValue: pattern,
          },
        },
        TopicArn: arn,
      };
      this.sns.publish(message, (error) => {
        if (error) {
          reject(new Error(`Could not publish message: ${error.message}`));
          return;
        }

        resolve(data);
      });
    });
  }

  publish(packet: ReadPacket<any>, callback: (packet: WritePacket<any>) => void): () => void {
    throw new Error("Publishing messages is currently not supported. Only emitting events is available");
  }

  private getTopicFromPattern(pattern: string): string {
    const [topic] = pattern.split(".");
    return topic;
  }
}
