import { createMock } from "@golevelup/ts-jest";

import { ChallengeResolver } from "@/challenge/challenge.resolver";
import { ChallengeService } from "@/challenge/challenge.service";
import { ChallengeStatus } from "@/challenge/enums/challenge-status";
import { LevelService } from "@/challenge/level.service";
import { Level } from "@/challenge/models/level.model";

import { ChallengeFactory } from "../factories/models/challenge.factory";
import { LevelFactory } from "../factories/models/level.factory";

describe("challenge resolver", () => {
  it("can resolve a challenge", async () => {
    const resolver = new ChallengeResolver(
      createMock<ChallengeService>({
        findOne: jest.fn().mockResolvedValue(ChallengeFactory.build()),
      }),
      createMock<LevelService>(),
    );

    const challenge = await resolver.challenge("uuid");

    expect(challenge).toBeTruthy();
  });

  it("resolves the levels for a challenge", async () => {
    const levels: Level[] = [LevelFactory.build(), LevelFactory.build()];

    const resolver = new ChallengeResolver(
      createMock<ChallengeService>(),
      createMock<LevelService>({
        findForChallenge: jest.fn().mockResolvedValue(levels),
      }),
    );
    const resolvedLevels = await resolver.levels(ChallengeFactory.build());

    expect(resolvedLevels).toBeTruthy();
    expect(resolvedLevels.length).toEqual(levels.length);
  });

  it("can resolve a challenge by slug", async () => {
    const resolver = new ChallengeResolver(
      createMock<ChallengeService>({
        findOneBySlug: jest.fn().mockResolvedValue(ChallengeFactory.build()),
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
        findAll: jest.fn().mockResolvedValue(slugs.map((slug) => ChallengeFactory.build({ slug }))),
      }),
      createMock<LevelService>(),
    );

    const challenges = await resolver.challenges();

    expect(challenges).toBeTruthy();
    expect(challenges.length).toBe(slugs.length);
  });

  it("resolves the status of a challenge", async () => {
    const resolver = new ChallengeResolver(
      createMock<ChallengeService>({
        getStatusForUserAndChallenge: jest.fn().mockResolvedValue(ChallengeStatus.FINISHED),
      }),
      createMock<LevelService>(),
    );

    const status = await resolver.status(ChallengeFactory.build(), { userId: "test_id" });

    expect(status).toBe(ChallengeStatus.FINISHED);
  });
});
