import { HashService } from "@/authentication/hash.service";

describe("hash service", () => {
  it("creates a hash which can be compared", async () => {
    const service = new HashService();
    const plaintext = "a11yphant";
    const hash = await service.make(plaintext);

    expect(service.compare(plaintext, hash)).resolves.toBe(true);
  });
});
