import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { RequirementStatus } from "../../src/challenge/enums/requirement-status.enum";
import { ResultStatus } from "../../src/submission/models/result-status.enum";
import { RequirementResultService } from "../../src/submission/requirement-result.service";
import { ChallengeFactory } from "../factories/database/challenge.factory";
import { CheckResultFactory } from "../factories/database/check-result.factory";
import { LevelFactory } from "../factories/database/level.factory";
import { RequirementFactory } from "../factories/database/requirement.factory";
import { ResultFactory } from "../factories/database/result.factory";
import { RuleFactory } from "../factories/database/rule.factory";
import { SubmissionFactory } from "../factories/database/submission.factory";
import { useDatabase } from "../helpers";

describe("requirement result service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can find requirement results for a result", async () => {
    const prisma = getPrismaService();
    const rule = await prisma.rule.create({ data: RuleFactory.build() });
    const challenge = await prisma.challenge.create({ data: ChallengeFactory.build() });
    const level = await prisma.level.create({ data: LevelFactory.build({ challengeId: challenge.id }) });
    const requirement = await prisma.requirement.create({ data: RequirementFactory.build({ ruleId: rule.id, levelId: level.id }) });
    const submission = await prisma.submission.create({ data: SubmissionFactory.build({ levelId: level.id }) });
    const submission2 = await prisma.submission.create({ data: SubmissionFactory.build({ levelId: level.id }) });
    const result = await prisma.result.create({ data: ResultFactory.build({ status: ResultStatus.SUCCESS, submissionId: submission.id }) });
    const result2 = await prisma.result.create({ data: ResultFactory.build({ status: ResultStatus.SUCCESS, submissionId: submission2.id }) });
    const requirementResult = await prisma.checkResult.create({
      data: CheckResultFactory.build({ resultId: result.id, requirementId: requirement.id }),
    });
    await prisma.checkResult.create({ data: CheckResultFactory.build({ resultId: result2.id, requirementId: requirement.id }) });

    const service = new RequirementResultService(prisma);

    const requirementResults = await service.findManyForResult(result.id);
    expect(requirementResults).toHaveLength(1);
    expect(requirementResults[0]).toHaveProperty("id", requirementResult.id);
  });

  it("can create an requirement result", async () => {
    const prisma = getPrismaService();
    const rule = await prisma.rule.create({ data: RuleFactory.build() });
    const challenge = await prisma.challenge.create({ data: ChallengeFactory.build() });
    const level = await prisma.level.create({ data: LevelFactory.build({ challengeId: challenge.id }) });
    const requirement = await prisma.requirement.create({ data: RequirementFactory.build({ ruleId: rule.id, levelId: level.id }) });
    const submission = await prisma.submission.create({ data: SubmissionFactory.build({ levelId: level.id }) });
    const result = await prisma.result.create({ data: ResultFactory.build({ status: ResultStatus.SUCCESS, submissionId: submission.id }) });

    const service = new RequirementResultService(prisma);
    const requirementResult = await service.create(result.id, requirement.id, RequirementStatus.SUCCESS);

    expect(requirementResult).toBeTruthy();
    expect(requirementResult.result).toBe(RequirementStatus.SUCCESS);
    expect(requirementResult.requirementId).toBe(requirement.id);
  });
});
