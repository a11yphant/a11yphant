import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { CheckResultFactory } from "@tests/factories/database/check-result.factory";
import { LevelFactory } from "@tests/factories/database/level.factory";
import { RequirementFactory } from "@tests/factories/database/requirement.factory";
import { ResultFactory } from "@tests/factories/database/result.factory";
import { RuleFactory } from "@tests/factories/database/rule.factory";
import { SubmissionFactory } from "@tests/factories/database/submission.factory";
import { useDatabase } from "@tests/helpers";

import { RequirementStatus } from "@/challenge/enums/requirement-status.enum";
import { ResultStatus } from "@/submission/models/result-status.enum";
import { RequirementResultService } from "@/submission/requirement-result.service";

describe("requirement result service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can find requirement results for a result", async () => {
    const prisma = getPrismaService();

    const result = await prisma.result.create({
      data: ResultFactory.build({}, { numberOfCheckResults: 3 }),
      include: { checkResults: true },
    });

    await prisma.checkResult.createMany({ data: CheckResultFactory.buildList(2) });

    const service = new RequirementResultService(prisma);

    const requirementResults = await service.findManyForResult(result.id);
    expect(requirementResults).toHaveLength(3);
  });

  it("can create an requirement result", async () => {
    const prisma = getPrismaService();
    const rule = await prisma.rule.create({ data: RuleFactory.build() });
    const level = await prisma.level.create({ data: LevelFactory.build() });
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
