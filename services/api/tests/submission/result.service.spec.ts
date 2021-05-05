import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { RuleStatus } from "../../src/challenge/enums/rule-status.enum";
import { ResultStatus } from "../../src/submission/models/result-status.enum";
import { ResultService } from "../../src/submission/result.service";
import { ChallengeFactory } from "../factories/database/challenge.factory";
import { CheckResultFactory } from "../factories/database/check-result.factory";
import { LevelFactory } from "../factories/database/level.factory";
import { RequirementFactory } from "../factories/database/requirement.factory";
import { ResultFactory } from "../factories/database/result.factory";
import { RuleFactory } from "../factories/database/rule.factory";
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

  it("returns the number of failed requirements for the result", async () => {
    const prisma = getPrismaService();

    const rule = await prisma.rule.create({ data: RuleFactory.build() });
    const challenge = await prisma.challenge.create({ data: ChallengeFactory.build() });
    const level = await prisma.level.create({ data: LevelFactory.build({ challengeId: challenge.id }) });
    const submission = await prisma.submission.create({ data: SubmissionFactory.build({ levelId: level.id }) });
    const submission2 = await prisma.submission.create({ data: SubmissionFactory.build({ levelId: level.id }) });
    const result = await prisma.result.create({ data: ResultFactory.build({ status: ResultStatus.SUCCESS, submissionId: submission.id }) });
    const result2 = await prisma.result.create({ data: ResultFactory.build({ status: ResultStatus.SUCCESS, submissionId: submission2.id }) });
    const requirement = await prisma.requirement.create({ data: RequirementFactory.build({ ruleId: rule.id, levelId: level.id }) });
    await prisma.checkResult.create({
      data: CheckResultFactory.build({ resultId: result.id, requirementId: requirement.id, status: RuleStatus.FAIL }),
    });
    await prisma.checkResult.create({
      data: CheckResultFactory.build({ resultId: result2.id, requirementId: requirement.id, status: RuleStatus.SUCCESS }),
    });

    const resultService = new ResultService(prisma);

    expect(await resultService.countNumberOfFailedRequirementChecks(result.id)).toBe(1);
  });

  it("returns the number of requirement checks for the result", async () => {
    const prisma = getPrismaService();
    const rule = await prisma.rule.create({ data: RuleFactory.build() });
    const challenge = await prisma.challenge.create({ data: ChallengeFactory.build() });
    const level = await prisma.level.create({ data: LevelFactory.build({ challengeId: challenge.id }) });
    const submission = await prisma.submission.create({ data: SubmissionFactory.build({ levelId: level.id }) });
    const submission2 = await prisma.submission.create({ data: SubmissionFactory.build({ levelId: level.id }) });
    const result = await prisma.result.create({ data: ResultFactory.build({ status: ResultStatus.SUCCESS, submissionId: submission.id }) });
    const result2 = await prisma.result.create({ data: ResultFactory.build({ status: ResultStatus.SUCCESS, submissionId: submission2.id }) });
    const requirement = await prisma.requirement.create({ data: RequirementFactory.build({ ruleId: rule.id, levelId: level.id }) });
    await prisma.checkResult.create({
      data: CheckResultFactory.build({ resultId: result.id, requirementId: requirement.id, status: RuleStatus.SUCCESS }),
    });
    await prisma.checkResult.create({
      data: CheckResultFactory.build({ resultId: result2.id, requirementId: requirement.id, status: RuleStatus.SUCCESS }),
    });

    const resultService = new ResultService(prisma);

    expect(await resultService.countNumberOfCheckedRequirements(result.id)).toBe(1);
  });

  it("can update the status of a result", async () => {
    const prisma = getPrismaService();
    const challenge = await prisma.challenge.create({ data: ChallengeFactory.build() });
    const level = await prisma.level.create({ data: LevelFactory.build({ challengeId: challenge.id }) });
    const submission = await prisma.submission.create({ data: SubmissionFactory.build({ levelId: level.id }) });
    const result = await prisma.result.create({ data: ResultFactory.build({ status: ResultStatus.SUCCESS, submissionId: submission.id }) });

    const resultService = new ResultService(prisma);

    expect(
      await resultService.update(result.id, {
        status: ResultStatus.SUCCESS,
      }),
    ).toHaveProperty("status", ResultStatus.SUCCESS);
  });
});
