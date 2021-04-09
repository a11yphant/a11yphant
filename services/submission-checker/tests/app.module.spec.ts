import { Test } from "@nestjs/testing";

import { AppModule } from "../src/app.module";

describe("app module", () => {
  it("can compile the module", () => {
    expect(
      Test.createTestingModule({
        imports: [AppModule],
      }).compile(),
    ).resolves.toBeTruthy();
  });
});
