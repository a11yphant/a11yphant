import { createMock } from "@golevelup/ts-jest";

import { HintResolver } from "./hint.resolver";
import { HintService } from "./hint.service";
import { Hint } from "./models/hint.model";

describe("hint resolver", () => {
  it("can resolve a hint", async () => {
    const resolver = new HintResolver(
      createMock<HintService>({
        findOneById: jest.fn().mockReturnValue(new Hint({ id: "uuid", content: "This is a hint." })),
      }),
    );

    expect(await resolver.hint("uuid")).toHaveProperty("id", "uuid");
  });
});
