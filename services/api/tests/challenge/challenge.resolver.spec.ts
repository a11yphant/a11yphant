import { createMock } from "@golevelup/ts-jest";

import { ChallengeResolver } from "../../src/challenge/challenge.resolver";
import { ChallengeService } from "../../src/challenge/challenge.service";
import { LevelService } from "../../src/challenge/level.service";
import { Challenge, challengeDifficulty } from "../../src/challenge/models/challenge.model";
import { Level } from "../../src/challenge/models/level.model";

describe("challenge resolver", () => {
  it("can resolve a challenge", async () => {
    const resolver = new ChallengeResolver(
      createMock<ChallengeService>({
        findOne: jest.fn().mockResolvedValue(new Challenge({ id: "uuid", name: "test", slug: "test-slug", difficulty: challengeDifficulty.EASY })),
      }),
      createMock<LevelService>(),
    );

    const challenge = await resolver.challenge("uuid");

    expect(challenge).toBeTruthy();
  });

  it("resolves the levels for a challenge", async () => {
    const challenge = new Challenge({ id: "uuid", name: "test", slug: "test-slug", difficulty: challengeDifficulty.EASY });
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
        findOneBySlug: jest.fn().mockResolvedValue(new Challenge({ id: "uuid", name: "test", slug: "slug", difficulty: challengeDifficulty.EASY })),
      }),
      createMock<LevelService>(),
    );

    const challenge = await resolver.challengeBySlug("test-slug");

    expect(challenge).toBeTruthy();
  });

  it("finds all challenges", async () => {
    const slugs = ["dani", "thomas", "luca", "michi"];

    const resolver = new ChallengeResolver(
      createMock<ChallengeService>({
        findAll: jest
          .fn()
          .mockResolvedValue(slugs.map((slug) => new Challenge({ id: "uuid", name: "test", slug, difficulty: challengeDifficulty.EASY }))),
      }),
      createMock<LevelService>(),
    );

    const challenges = await resolver.challenges();

    expect(challenges).toBeTruthy();
    expect(challenges.length).toBe(slugs.length);
  });
});
