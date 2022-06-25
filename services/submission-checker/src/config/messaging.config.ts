import { registerAs } from "@nestjs/config";

export default registerAs("messaging", () => ({
  "rabbitmq-url": process.env.SUBMISSION_CHECKER_MESSAGING_RABBITMQ_URL,
  "consume-queue-name": process.env.SUBMISSION_CHECKER_MESSAGING_CONSUME_QUEUE_NAME,
  "publish-queue-name": process.env.SUBMISSION_CHECKER_MESSAGING_PUBLISH_QUEUE_NAME,
}));
