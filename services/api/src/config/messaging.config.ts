import { parseTopics } from "@a11y-challenges/nestjs-aws-messaging";
import { registerAs } from "@nestjs/config";

export default registerAs("messaging", () => ({
  region: process.env.API_MESSAGING_REGION || "us-east-1",
  topics: parseTopics(process.env.API_MESSAGING_TOPICS || ""),
  "sns-endpoint": process.env.API_MESSAGING_ENDPOINT,
}));
