import { Inject, Logger } from "@nestjs/common";
import { ClientProxy, ReadPacket, WritePacket } from "@nestjs/microservices";
import AWS from "aws-sdk";

import { AwsMessagingModuleConfig } from "./aws-messaging.module";
import { AWS_MESSAGING_MODULE_CONFIG } from "./constants";

export class AwsMessagingClient extends ClientProxy {
  private sns: AWS.SNS;

  constructor(@Inject(AWS_MESSAGING_MODULE_CONFIG) private options: AwsMessagingModuleConfig, private logger: Logger) {
    super();

    AWS.config.update({ region: this.options.region });
    this.sns = new AWS.SNS({ apiVersion: "2010-03-31", endpoint: this.options.snsEndpoint });
  }

  async connect(): Promise<void> {
    // there is no need to connect to something
  }

  async close(): Promise<void> {
    // there is no need to disconnect from something
  }

  async dispatchEvent<T = any>({ pattern, data }: ReadPacket<T>): Promise<T> {
    const topic = this.getTopicFromPattern(pattern);
    const arn = this.options.topics[topic];

    if (!arn) {
      const errorMessage = `Cannot find arn for topic ${topic}. Make sure that the arn is included in the configuration`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
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

    try {
      await this.sns.publish(message).promise();
    } catch (error) {
      const errorMessage = `Could not publish message: ${error.message}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    this.logger.log(`Published message to topic ${topic} with type ${message.MessageAttributes.type.StringValue}`, AwsMessagingClient.name);

    return data;
  }

  publish(packet: ReadPacket<any>, callback: (packet: WritePacket<any>) => void): () => void {
    const message = "Publishing messages is currently not supported. Only emitting events is available";
    this.logger.error(message);
    throw new Error(message);
  }

  private getTopicFromPattern(pattern: string): string {
    const [topic] = pattern.split(".");
    return topic;
  }
}
