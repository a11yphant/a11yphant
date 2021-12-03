import { createMock } from "@golevelup/ts-jest";
import { CodeLevelFactory } from "@tests/support/factories/models/code-level.factory";

import { LevelResolver } from "@/challenge/level.resolver";
import { LevelService } from "@/challenge/level.service";

describe("level resolver", () => {
  it("resolves a level by challenge slug and index", async () => {
    const findOneForChallengeAtIndex = jest.fn().mockResolvedValue(CodeLevelFactory.build({ id: "second-id" }));
    const resolver = new LevelResolver(
      createMock<LevelService>({
        findOneForChallengeAtIndex,
      }),
    );

    expect(await resolver.levelByChallengeSlug({ challengeSlug: "level", nth: 2 })).toHaveProperty("id", "second-id");
    expect(findOneForChallengeAtIndex).toHaveBeenCalledWith("level", 1);
  });
});
