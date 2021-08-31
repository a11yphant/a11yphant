import { createMock } from "@golevelup/ts-jest";
import { LevelFactory } from "@tests/factories/models/level.factory";

import { SessionToken } from "@/authentication/session-token.interface";
import { LevelService } from "@/challenge/level.service";
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
    const save = jest.fn().mockResolvedValue({});
    const resolver = new SubmissionResolver(
      createMock<SubmissionService>({
        save,
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

    await resolver.createSubmission(submission, sessionToken);

    expect(save).toHaveBeenCalledWith({ ...submission, userId: sessionToken.userId });
  });
});
