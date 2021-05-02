import { parseTopics } from "../lib";

describe("helpers", () => {
  describe("parse topics", () => {
    it("creates a dictionary from a single topic in the env string", () => {
      const topic = "submission";
      const arn = "topic:arn";
      const envString = `${topic}=${arn}`;

      expect(parseTopics(envString)).toHaveProperty(topic, arn);
    });

    it("creates a dictionary from a multiple topics in the env string", () => {
      const topic1 = "submission";
      const arn1 = "topic:arn";
      const topic2 = "user";
      const arn2 = "user-topic:arn";
      const envString = `${topic1}=${arn1},${topic2}=${arn2}`;

      const topics = parseTopics(envString);

      expect(topics).toHaveProperty(topic1, arn1);
      expect(topics).toHaveProperty(topic2, arn2);
    });
  });
});
