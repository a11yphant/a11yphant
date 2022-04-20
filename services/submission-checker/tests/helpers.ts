import { INestMicroservice } from "@nestjs/common";
import amqp from "amqplib";

const SUBMISSION_CHECKER_MESSAGING_CONSUME_QUEUE_NAME = "submission-checker-test";
const SUBMISSION_CHECKER_MESSAGING_PUBLISH_QUEUE_NAME = "api-test";

const ORIGINAL_ENV = { ...process.env };

const env = {
  IGNORE_ENV_FILE: "true",
  SUBMISSION_CHECKER_MESSAGING_CONSUME_QUEUE_NAME,
  SUBMISSION_CHECKER_MESSAGING_PUBLISH_QUEUE_NAME,
  SUBMISSION_CHECKER_RENDERER_BASE_URL: "https://url.com/render/",
  SUBMISSION_CHECKER_DISABLE_LOGGER: "1",
};

function setUpEnv(): void {
  Object.keys(env).forEach((key) => {
    process.env[key] = env[key];
  });
}

function resetEnv(): void {
  Object.keys(ORIGINAL_ENV).forEach((key) => {
    process.env[key] = env[key];
  });
}

export function useApp(): void {
  let app: INestMicroservice;

  beforeEach(async () => {
    setUpEnv();
    const { getApp } = await import("@/main");
    app = await getApp();
  });

  afterEach(async () => {
    await removeAllMessagesFromQueue(SUBMISSION_CHECKER_MESSAGING_CONSUME_QUEUE_NAME);
    await removeAllMessagesFromQueue(SUBMISSION_CHECKER_MESSAGING_PUBLISH_QUEUE_NAME);
    resetEnv();
    await app.close();
  });
}

export async function useApiQueueSubscription(callback: (msg: amqp.ConsumeMessage) => {}): Promise<{ close: () => Promise<void> }> {
  const connection = await amqp.connect(process.env.SUBMISSION_CHECKER_MESSAGING_RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(SUBMISSION_CHECKER_MESSAGING_PUBLISH_QUEUE_NAME);
  channel.consume(SUBMISSION_CHECKER_MESSAGING_PUBLISH_QUEUE_NAME, (msg) => {
    callback(msg);
    channel.ack(msg);
  });

  return {
    close: async () => {
      await channel.close();
      await connection.close();
    },
  };
}

export async function publishMessageForSubmissionChecker(message: Record<string, any>): Promise<void> {
  const connection = await amqp.connect(process.env.SUBMISSION_CHECKER_MESSAGING_RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(SUBMISSION_CHECKER_MESSAGING_CONSUME_QUEUE_NAME);
  channel.sendToQueue(SUBMISSION_CHECKER_MESSAGING_CONSUME_QUEUE_NAME, Buffer.from(JSON.stringify(message)), {});
  await channel.close();
  await connection.close();
}

async function removeAllMessagesFromQueue(queueName: string): Promise<void> {
  const connection = await amqp.connect(process.env.SUBMISSION_CHECKER_MESSAGING_RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName);
  await channel.purgeQueue(queueName);
  await channel.close();
  await connection.close();
}
