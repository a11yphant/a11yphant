import { createMock } from "@golevelup/ts-jest";
import { CodeLevelFactory } from "@tests/factories/models/code-level.factory";

import { LevelStatus } from "@/challenge/enums/level-status.enum";
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

  it("resolves out the status of a level", async () => {
    const resolver = new LevelResolver(
      createMock<LevelService>({
        findStatusForUserAndLevel: jest.fn().mockResolvedValue(LevelStatus.OPEN),
      }),
    );
    const status = await resolver.status(CodeLevelFactory.build(), { userId: "userid" });

    expect(status).toBe(LevelStatus.OPEN);
  });
});
