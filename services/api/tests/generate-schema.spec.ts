import fs from "fs";

import { generateSchema } from "@/generate-schema";

jest.spyOn(fs, "writeFileSync");

describe("generate schema", () => {
  it("can generate the schema", async () => {
    await expect(generateSchema()).resolves.toBeUndefined();
  });

  it("writes the schema to schema.gql", async () => {
    await generateSchema();

    expect(fs.writeFileSync).toHaveBeenCalledWith("schema.gql", expect.any(String));
  });
});
