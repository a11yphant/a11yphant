import { createMock } from "@golevelup/ts-jest";
import { UserInputError } from "apollo-server-express";

import { SessionToken } from "@/authentication/interfaces/session-token.interface";
import { SubmissionService } from "@/submission";
import { SubmissionAlreadyHasCheckResultException } from "@/submission/exceptions/submission-already-has-check-result.exception";
import { SubmissionNotFoundException } from "@/submission/exceptions/submission-not-found.exception";
import { CreateCodeLevelSubmissionInput } from "@/submission/graphql/inputs/create-code-level-submission.input";
import { UpdateCodeLevelSubmissionInput } from "@/submission/graphql/inputs/update-code-level-submission.input";
import { CodeLevelSubmissionResolver } from "@/submission/graphql/resolvers/code-level-submission.resolver";

describe("code level submission resolver", () => {
  it("can create a submission", async () => {
    const create = jest.fn().mockResolvedValue({});
    const resolver = new CodeLevelSubmissionResolver(
      createMock<SubmissionService>({
        create,
      }),
    );
    const sessionToken: SessionToken = { userId: "uuid" };
    const submission: CreateCodeLevelSubmissionInput = {
      levelId: "uuid",
      html: "bla",
      css: "blub",
      js: "bli",
    };

    const result = await resolver.createCodeLevelSubmission(submission, sessionToken);

    expect(result.submission).toBeTruthy();
    expect(create).toHaveBeenCalledWith({ ...submission, userId: sessionToken.userId });
  });

  it("can update a submission", async () => {
    const update = jest.fn().mockResolvedValue({});
    const resolver = new CodeLevelSubmissionResolver(
      createMock<SubmissionService>({
        update,
      }),
    );
    const sessionToken: SessionToken = { userId: "uuid" };
    const submission: UpdateCodeLevelSubmissionInput = {
      id: "uuid",
      html: "bla",
      css: "blub",
      js: "bli",
    };

    const result = await resolver.updateCodeLevelSubmission(submission, sessionToken);

    expect(result.submission).toBeTruthy();
    expect(update).toHaveBeenCalledWith({ ...submission, userId: sessionToken.userId });
  });

  it("returns an error if the submission to update was not found", () => {
    const update = jest.fn().mockRejectedValue(new SubmissionNotFoundException());
    const resolver = new CodeLevelSubmissionResolver(
      createMock<SubmissionService>({
        update,
      }),
    );
    const sessionToken: SessionToken = { userId: "uuid" };
    const submission: UpdateCodeLevelSubmissionInput = {
      id: "uuid",
      html: "bla",
      css: "blub",
      js: "bli",
    };

    expect(resolver.updateCodeLevelSubmission(submission, sessionToken)).rejects.toBeInstanceOf(UserInputError);
  });

  it("can request a check for submission", async () => {
    const requestCheck = jest.fn().mockResolvedValue({ id: "uuid" });
    const resolver = new CodeLevelSubmissionResolver(createMock<SubmissionService>({ requestCheck }));

    const mutationResult = await resolver.requestCodeLevelCheck({ submissionId: "bla" });

    expect(mutationResult.result).toHaveProperty("id", "uuid");
    expect(requestCheck).toHaveBeenCalledWith("bla");
  });

  it("cannot request a check for the same submission multiple time", () => {
    const resolver = new CodeLevelSubmissionResolver(
      createMock<SubmissionService>({ requestCheck: jest.fn().mockRejectedValue(new SubmissionAlreadyHasCheckResultException()) }),
    );

    expect(resolver.requestCodeLevelCheck({ submissionId: "bla" })).rejects.toBeInstanceOf(UserInputError);
  });
});
