import { parseTopics } from "@a11y-challenges/nestjs-aws-messaging";
import { registerAs } from "@nestjs/config";

export default registerAs("messaging", () => ({
  "poll-queue": process.env.SUBMISSION_CHECKER_MESSAGING_POLL_QUEUE || false,
  "queue-url": process.env.SUBMISSION_CHECKER_MESSAGING_QUEUE_URL,
  region: process.env.SUBMISSION_CHECKER_MESSAGING_REGION || "us-east-1",
  topics: parseTopics(process.env.SUBMISSION_CHECKER_MESSAGING_TOPICS || ""),
  "delete-handled-messages": Boolean(+process.env.SUBMISSION_CHECKER_MESSAGING_DELETE_HANDLED_MESSAGES) || true,
}));
