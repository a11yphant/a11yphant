export function parseTopics(topics: string): Record<string, string> {
  return topics.split(",").reduce((topics, current) => {
    const [topic, arn] = current.split("=");

    return { ...topics, [topic]: arn };
  }, {});
}
