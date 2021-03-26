import { registerAs } from "@nestjs/config";

function parseTopics(topics: string): Record<string, string> {
  return topics.split(",").reduce((topics, current) => {
    const [topic, arn] = current.split("=");

    return { ...topics, [topic]: arn };
  }, {});
}

export default registerAs("messaging", () => ({
  region: process.env.API_MESSAGING_REGION || "us-east-1",
  topics: parseTopics(process.env.API_MESSAGING_TOPICS || ""),
  "sns-endpoint": process.env.API_MESSAGING_ENDPOINT,
}));
