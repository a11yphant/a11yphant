import { createMock } from "@golevelup/ts-jest";
import { GraphQLError } from "graphql";

import { SessionToken } from "@/authentication/interfaces/session-token.interface";
import { SubmissionService } from "@/submission";
import { SubmissionAlreadyHasCheckResultException } from "@/submission/exceptions/submission-already-has-check-result.exception";
import { SubmissionNotFoundException } from "@/submission/exceptions/submission-not-found.exception";
import { CreateCodeLevelSubmissionInput } from "@/submission/graphql/inputs/create-code-level-submission.input";
import { UpdateCodeLevelSubmissionInput } from "@/submission/graphql/inputs/update-code-level-submission.input";
import { CodeLevelSubmissionResolver } from "@/submission/graphql/resolvers/code-level-submission.resolver";

function createCodeLevelSubmissionResolver(
  partials: {
    submissionService?: Partial<SubmissionService>;
  } = {},
): CodeLevelSubmissionResolver {
  const submissionService = createMock<SubmissionService>(partials.submissionService);

  return new CodeLevelSubmissionResolver(submissionService);
}

describe("code level submission resolver", () => {
  const sessionToken: SessionToken = { userId: "uuid" };

  it("can create a submission", async () => {
    const create = jest.fn().mockResolvedValue({});

    const submission: CreateCodeLevelSubmissionInput = {
      levelId: "uuid",
      html: "bla",
      css: "blub",
      js: "bli",
    };

    const resolver = createCodeLevelSubmissionResolver({ submissionService: { create } });
    const result = await resolver.createCodeLevelSubmission(submission, sessionToken);

    expect(result.submission).toBeTruthy();
    expect(create).toHaveBeenCalledWith({ ...submission, userId: sessionToken.userId });
  });

  it("can update a submission", async () => {
    const update = jest.fn().mockResolvedValue({});

    const submission: UpdateCodeLevelSubmissionInput = {
      id: "uuid",
      html: "bla",
      css: "blub",
      js: "bli",
    };

    const resolver = createCodeLevelSubmissionResolver({ submissionService: { update } });
    const result = await resolver.updateCodeLevelSubmission(submission, sessionToken);

    expect(result.submission).toBeTruthy();
    expect(update).toHaveBeenCalledWith({ ...submission, userId: sessionToken.userId });
  });

  it("returns an error if the submission to update was not found", () => {
    const update = jest.fn().mockRejectedValue(new SubmissionNotFoundException());

    const submission: UpdateCodeLevelSubmissionInput = {
      id: "uuid",
      html: "bla",
      css: "blub",
      js: "bli",
    };

    const resolver = createCodeLevelSubmissionResolver({ submissionService: { update } });

    expect(resolver.updateCodeLevelSubmission(submission, sessionToken)).rejects.toThrowError(GraphQLError);
    expect(update).toHaveBeenCalled();
  });

  it("can request a check for submission", async () => {
    const requestCheck = jest.fn().mockResolvedValue({ id: "uuid" });

    const resolver = createCodeLevelSubmissionResolver({ submissionService: { requestCheck } });
    const mutationResult = await resolver.requestCodeLevelCheck({ submissionId: "bla" });

    expect(mutationResult.result).toBeTruthy();
    expect(requestCheck).toHaveBeenCalledWith("bla");
  });

  it("cannot request a check for the same submission multiple time", () => {
    const requestCheck = jest.fn().mockRejectedValue(new SubmissionAlreadyHasCheckResultException());

    const resolver = createCodeLevelSubmissionResolver({ submissionService: { requestCheck } });
    expect(resolver.requestCodeLevelCheck({ submissionId: "bla" })).rejects.toThrowError(GraphQLError);
  });
});
