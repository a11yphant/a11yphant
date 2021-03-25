import { registerAs } from "@nestjs/config";

function parseTopics(topics: string): Record<string, string> {
  return topics.split(",").reduce((topics, current) => {
    const [topic, arn] = current.split("=");

    return { ...topics, [topic]: arn };
  }, {});
}

export default registerAs("sns", () => ({
  region: process.env.API_SNS_REGION || "us-east-1",
  topics: parseTopics(process.env.API_SNS_TOPICS || ""),
  endpoint: process.env.API_SNS_ENDPOINT,
}));
