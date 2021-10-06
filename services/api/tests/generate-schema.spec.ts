import { generateSchema } from "@/generate-schema";

describe("generate schema", () => {
  it("can generate the schema", async () => {
    await expect(generateSchema()).resolves.toBeUndefined();
  });
});
