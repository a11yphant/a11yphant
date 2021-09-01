import { createMock } from "@golevelup/ts-jest";
import { LevelFactory } from "@tests/factories/models/level.factory";
import { UserInputError } from "apollo-server-express";

import { SessionToken } from "@/authentication/session-token.interface";
import { LevelService } from "@/challenge/level.service";
import { SubmissionAlreadyHasCheckResultException } from "@/submission/exceptions/submission-already-has-check-result.exception";
import { Submission } from "@/submission/models/submission.model";
import { SubmissionInput } from "@/submission/submission.input";
import { SubmissionResolver } from "@/submission/submission.resolver";
import { SubmissionService } from "@/submission/submission.service";

describe("submission resolver", () => {
  it("can submit a challenge", async () => {
    const resolver = new SubmissionResolver(
      createMock<SubmissionService>({
        save: jest.fn().mockResolvedValue(
          new Submission({
            id: "identifier",
            levelId: "best level ever",
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        ),
      }),
      createMock<LevelService>(),
    );

    const submission = await resolver.submit({ levelId: "hallo luca" }, { userId: "uuid" });

    expect(submission).toBeTruthy();
  });

  it("can resolve a level", async () => {
    const mockLevel = LevelFactory.build();

    const resolver = new SubmissionResolver(
      createMock<SubmissionService>(),
      createMock<LevelService>({
        findOne: jest.fn().mockResolvedValue(mockLevel),
      }),
    );

    const level = await resolver.level(new Submission({ id: "bla", levelId: "blu", createdAt: new Date(), updatedAt: new Date() }));

    expect(level).toBeTruthy();
    expect(level.id).toBe(mockLevel.id);
  });

  it("can create a submission", async () => {
    const create = jest.fn().mockResolvedValue({});
    const resolver = new SubmissionResolver(
      createMock<SubmissionService>({
        create,
      }),
      createMock<LevelService>(),
    );
    const sessionToken: SessionToken = { userId: "uuid" };
    const submission: SubmissionInput = {
      levelId: "uuid",
      html: "bla",
      css: "blub",
      js: "bli",
    };

    const result = await resolver.createSubmission(submission, sessionToken);

    expect(result.submission).toBeTruthy();
    expect(create).toHaveBeenCalledWith({ ...submission, userId: sessionToken.userId });
  });

  it("can request a check for submission", async () => {
    const requestCheck = jest.fn().mockResolvedValue({ id: "uuid" });
    const resolver = new SubmissionResolver(createMock<SubmissionService>({ requestCheck }), createMock<LevelService>());

    const mutationResult = await resolver.requestCheck({ submissionId: "bla" });

    expect(mutationResult.result).toHaveProperty("id", "uuid");
    expect(requestCheck).toHaveBeenCalledWith("bla");
  });

  it("cannot request a check for the same submission multiple time", () => {
    const resolver = new SubmissionResolver(
      createMock<SubmissionService>({ requestCheck: jest.fn().mockRejectedValue(new SubmissionAlreadyHasCheckResultException()) }),
      createMock<LevelService>(),
    );

    expect(resolver.requestCheck({ submissionId: "bla" })).rejects.toBeInstanceOf(UserInputError);
  });
});
