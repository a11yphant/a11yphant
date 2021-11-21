import { createMock } from "@golevelup/ts-jest";
import { ChallengeFactory } from "@tests/support/factories/models/challenge.factory";

import { SessionToken } from "@/authentication/interfaces/session-token.interface";
import { ChallengeResolver } from "@/challenge/challenge.resolver";
import { ChallengeService } from "@/challenge/challenge.service";
import { ChallengeStatus } from "@/challenge/enums/challenge-status";
import { LevelService } from "@/challenge/level.service";

describe("challenge resolver", () => {
  const challenge = ChallengeFactory.build();
  const sessionToken: SessionToken = { userId: "userId" };

  it("can resolve a challenge", async () => {
    const findOne = jest.fn().mockResolvedValue(ChallengeFactory.build());
    const id = "uuid";

    const resolver = new ChallengeResolver(createMock<ChallengeService>({ findOne }), createMock<LevelService>());
    const resolvedChallenge = await resolver.challenge(id);

    expect(resolvedChallenge).toBeTruthy();
    expect(findOne).toHaveBeenCalledWith(id);
  });

  it("resolves the levels for a challenge", async () => {
    const findForChallenge = jest.fn().mockResolvedValue([]);

    const resolver = new ChallengeResolver(createMock<ChallengeService>(), createMock<LevelService>({ findForChallenge }));
    const resolvedLevels = await resolver.levels(challenge);

    expect(resolvedLevels).toBeTruthy();
    expect(findForChallenge).toHaveBeenCalledWith(challenge.id);
  });

  it("can resolve a challenge by slug", async () => {
    const findOneBySlug = jest.fn().mockResolvedValue(ChallengeFactory.build());

    const resolver = new ChallengeResolver(createMock<ChallengeService>({ findOneBySlug }), createMock<LevelService>());
    const resolvedChallenge = await resolver.challengeBySlug("test-slug");

    expect(resolvedChallenge).toBeTruthy();
    expect(findOneBySlug).toHaveBeenCalledWith("test-slug");
  });

  it("finds all challenges", async () => {
    const findAll = jest.fn().mockResolvedValue([]);

    const resolver = new ChallengeResolver(createMock<ChallengeService>({ findAll }), createMock<LevelService>());

    const resolvedChallenges = await resolver.challenges();

    expect(resolvedChallenges).toBeTruthy();
    expect(findAll).toHaveBeenCalled();
  });

  it("resolves the status of a challenge for the current user", async () => {
    const getStatusForUserAndChallenge = jest.fn().mockResolvedValue(ChallengeStatus.FINISHED);

    const resolver = new ChallengeResolver(createMock<ChallengeService>({ getStatusForUserAndChallenge }), createMock<LevelService>());
    const status = await resolver.status(challenge, sessionToken);

    expect(status).toBeTruthy();
    expect(getStatusForUserAndChallenge).toHaveBeenCalledWith(sessionToken.userId, challenge.id);
  });

  it("resolves the status of a challenge for a given user", async () => {
    const getStatusForUserAndChallenge = jest.fn().mockResolvedValue(ChallengeStatus.FINISHED);
    const userId = "userId";

    const resolver = new ChallengeResolver(createMock<ChallengeService>({ getStatusForUserAndChallenge }), createMock<LevelService>());
    const resolvedStatus = await resolver.statusForUser(challenge, userId);

    expect(resolvedStatus).toBeTruthy();
    expect(getStatusForUserAndChallenge).toHaveBeenCalledWith(userId, challenge.id);
  });

  it("resolves then number of completed levels for a user", async () => {
    const getNumberOfFinishedLevelsForUserAndChallenge = jest.fn().mockResolvedValue(4);

    const resolver = new ChallengeResolver(
      createMock<ChallengeService>({ getNumberOfFinishedLevelsForUserAndChallenge }),
      createMock<LevelService>(),
    );
    const status = await resolver.numberOfFinishedLevels(challenge, sessionToken);

    expect(status).toBeTruthy();
    expect(getNumberOfFinishedLevelsForUserAndChallenge).toHaveBeenCalledWith(sessionToken.userId, challenge.id);
  });
});
