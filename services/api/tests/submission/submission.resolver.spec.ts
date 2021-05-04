import { createMock } from "@golevelup/ts-jest";

import { LevelService } from "../../src/challenge/level.service";
import { Level } from "../../src/challenge/models/level.model";
import { Submission } from "../../src/submission/models/submission.model";
import { SubmissionResolver } from "../../src/submission/submission.resolver";
import { SubmissionService } from "../../src/submission/submission.service";

describe("submission resolver", () => {
  it("can submit a challenge", async () => {
    const resolver = new SubmissionResolver(
      createMock<SubmissionService>({
        save: jest.fn().mockResolvedValue(
          new Submission({
            id: "identifier",
            levelId: "best level ever",
          }),
        ),
      }),
      createMock<LevelService>(),
    );

    const submission = await resolver.submit({ levelId: "hallo luca" });

    expect(submission).toBeTruthy();
  });

  it("can resolve a level", async () => {
    const mockLevel = new Level({
      id: "id",
      tldr: "halloo",
      instructions: "hallo aus den tests",
      order: 0,
    });

    const resolver = new SubmissionResolver(
      createMock<SubmissionService>(),
      createMock<LevelService>({
        findOne: jest.fn().mockResolvedValue(mockLevel),
      }),
    );

    const level = await resolver.level(new Submission({ id: "bla", levelId: "blu" }));

    expect(level).toBeTruthy();
    expect(level.id).toBe(mockLevel.id);
  });
});
