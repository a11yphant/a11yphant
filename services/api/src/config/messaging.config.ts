import { parseTopics } from "@a11yphant/nestjs-aws-messaging";
import { registerAs } from "@nestjs/config";

export default registerAs("messaging", () => ({
  "poll-queue": process.env.API_MESSAGING_POLL_QUEUE || false,
  "queue-url": process.env.API_MESSAGING_QUEUE_URL,
  "sns-endpoint": process.env.API_MESSAGING_SNS_ENDPOINT,
  region: process.env.API_MESSAGING_REGION || "us-east-1",
  topics: parseTopics(process.env.API_MESSAGING_TOPICS || ""),
}));
