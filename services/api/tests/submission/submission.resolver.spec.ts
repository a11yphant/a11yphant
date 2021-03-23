import { createMock } from "@golevelup/ts-jest";

import { LevelService } from "../../src/challenge/level.service";
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
          }),
        ),
      }),
      createMock<LevelService>(),
    );

    const submission = await resolver.submit({ levelId: "hallo luca" });

    expect(submission).toBeTruthy();
  });
});
