import { Test } from "@nestjs/testing";

import { AppModule } from "@/app.module";

describe("app module", () => {
  it("can compile the module", async () => {
    expect.assertions(1);
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
