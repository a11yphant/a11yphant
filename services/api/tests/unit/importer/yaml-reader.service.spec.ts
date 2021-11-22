import mock from "mock-fs";

import { Challenge } from "@/importer/challenge.interface";
import { YamlReaderService } from "@/importer/yaml-reader.service";

const yamlOne = `
challenge:
    id: 6a15a6de-306c-4a8b-9765-a1d5c6b91083
`;

describe("YAML reader service", () => {
  afterEach(() => {
    mock.restore();
  });

  it("can read a yaml file", async () => {
    mock({
      test: {
        "1.yml": yamlOne,
      },
    });
    const reader = new YamlReaderService();

    const challenge = await reader.readFile<Challenge>("test/1.yml", "challenge");

    expect(challenge).toBeTruthy();
    expect(challenge.id).toEqual("6a15a6de-306c-4a8b-9765-a1d5c6b91083");
  });
});
