import { createMock } from "@golevelup/ts-jest";

import { ChallengeResolver } from "./challenge.resolver";
import { ChallengeService } from "./challenge.service";
import { LevelService } from "./level.service";
import { Challenge } from "./models/challenge.model";
import { Level } from "./models/level.model";

describe("challenge resolver", () => {
  it("can resolve a challenge", async () => {
    const resolver = new ChallengeResolver(
      createMock<ChallengeService>({
        findOne: jest.fn().mockResolvedValue(new Challenge({ id: "uuid", name: "test", slug: "test-slug" })),
      }),
      createMock<LevelService>(),
    );

    const challenge = await resolver.challenge("uuid");

    expect(challenge).toBeTruthy();
  });

  it("resolves the levels for a challenge", async () => {
    const challenge = new Challenge({ id: "uuid", name: "test", slug: "test-slug" });
    const levels: Level[] = [
      { id: "uuid", hints: [], instructions: "please read the instructions", requirements: [], resources: [], tldr: "don't want to read" },
    ];

    const resolver = new ChallengeResolver(
      createMock<ChallengeService>(),
      createMock<LevelService>({
        findForChallenge: jest.fn().mockResolvedValue(levels),
      }),
    );
    const resolvedLevels = await resolver.levels(challenge);

    expect(resolvedLevels).toBeTruthy();
    expect(resolvedLevels.length).toEqual(levels.length);
  });

  it("can resolve a challenge by slug", async () => {
    const resolver = new ChallengeResolver(
      createMock<ChallengeService>({
        findOneBySlug: jest.fn().mockResolvedValue(new Challenge({ id: "uuid", name: "test", slug: "slug" })),
      }),
      createMock<LevelService>(),
    );

    const challenge = await resolver.challengeBySlug("test-slug");

    expect(challenge).toBeTruthy();
  });
});
