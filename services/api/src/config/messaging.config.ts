import { registerAs } from "@nestjs/config";

export default registerAs("messaging", () => ({
  "rabbitmq-url": process.env.API_MESSAGING_RABBITMQ_URL,
  "consume-queue-name": process.env.API_MESSAGING_CONSUME_QUEUE_NAME,
  "publish-queue-name": process.env.API_MESSAGING_PUBLISH_QUEUE_NAME,
}));
