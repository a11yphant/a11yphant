import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { ResultService } from "../../src/submission/result.service";
import { ChallengeFactory } from "../factories/database/challenge.factory";
import { LevelFactory } from "../factories/database/level.factory";
import { ResultFactory } from "../factories/database/result.factory";
import { SubmissionFactory } from "../factories/database/submission.factory";
import { useDatabase } from "../helpers";

describe("result service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("returns the result for a submission", async () => {
    const prisma = getPrismaService();

    const challenge = await prisma.challenge.create({ data: ChallengeFactory.build() });
    const level = await prisma.level.create({ data: LevelFactory.build({ challengeId: challenge.id }) });
    const submission = await prisma.submission.create({ data: SubmissionFactory.build({ levelId: level.id }) });
    const expectedResult = await prisma.result.create({ data: ResultFactory.build({ submissionId: submission.id }) });

    const resultService = new ResultService(prisma);

    const foundResult = await resultService.findOneForSubmission(submission.id);

    expect(foundResult).toBeTruthy();
    expect(foundResult.id).toEqual(expectedResult.id);
  });
});
