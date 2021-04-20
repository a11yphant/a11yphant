import { createMock } from "@golevelup/ts-jest";

import { HintResolver } from "../../src/challenge/hint.resolver";
import { HintService } from "../../src/challenge/hint.service";
import { Hint } from "../../src/challenge/models/hint.model";

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
