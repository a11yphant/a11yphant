import { Test } from "@nestjs/testing";

import { AppModule } from "../src/app.module";

describe("app module", () => {
  it("can instantiate the module", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(moduleRef).toBeTruthy();
  });
});
