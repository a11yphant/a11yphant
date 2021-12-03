import { createMock } from "@golevelup/ts-jest";
import { ChallengeFactory } from "@tests/support/factories/models/challenge.factory";
import { CodeLevelFactory } from "@tests/support/factories/models/code-level.factory";

import { ChallengeResolver } from "@/challenge/challenge.resolver";
import { ChallengeService } from "@/challenge/challenge.service";
import { ChallengeStatus } from "@/challenge/enums/challenge-status";
import { LevelService } from "@/challenge/level.service";
import { Level } from "@/challenge/models/level.model";

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
    const levels: Level[] = [CodeLevelFactory.build(), CodeLevelFactory.build()];

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

  it("resolves the status of a challenge for the current user", async () => {
    const resolver = new ChallengeResolver(
      createMock<ChallengeService>({
        getStatusForUserAndChallenge: jest.fn().mockResolvedValue(ChallengeStatus.FINISHED),
      }),
      createMock<LevelService>(),
    );

    const status = await resolver.status(ChallengeFactory.build(), { userId: "test_id" });

    expect(status).toBe(ChallengeStatus.FINISHED);
  });

  it("resolves the status of a challenge for a given user", async () => {
    const resolver = new ChallengeResolver(
      createMock<ChallengeService>({
        getStatusForUserAndChallenge: jest.fn().mockResolvedValue(ChallengeStatus.FINISHED),
      }),
      createMock<LevelService>(),
    );

    const status = await resolver.statusForUser(ChallengeFactory.build(), "userId");

    expect(status).toBe(ChallengeStatus.FINISHED);
  });

  it("resolves then number of completed levels for a user", async () => {
    const resolver = new ChallengeResolver(
      createMock<ChallengeService>({
        getNumberOfFinishedLevelsForUserAndChallenge: jest.fn().mockResolvedValue(4),
      }),
      createMock<LevelService>(),
    );

    const status = await resolver.numberOfFinishedLevels(ChallengeFactory.build(), { userId: "userId" });

    expect(status).toEqual(4);
  });
});
