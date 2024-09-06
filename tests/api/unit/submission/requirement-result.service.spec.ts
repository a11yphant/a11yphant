/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import {
  CHECK_RESULT,
  CheckResultData,
  CODE_LEVEL_RESULT,
  CodeLevelResultData,
  Factory,
  REQUIREMENT,
  RequirementData,
} from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";

import { RequirementStatus } from "@/challenge/enums/requirement-status.enum";
import { ResultStatus } from "@/submission/graphql/models/result-status.enum";
import { RequirementResultService } from "@/submission/services/requirement-result.service";

describe("requirement result service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can find requirement results for a result", async () => {
    const prisma = getPrismaService();

    const result = await prisma.codeLevelResult.create({
      data: Factory.build<CodeLevelResultData>(CODE_LEVEL_RESULT, {}, { numberOfCheckResults: 3 }),
      include: { checkResults: true },
    });

    await prisma.checkResult.create({
      data: Factory.build<CheckResultData>(CHECK_RESULT),
    });

    const service = new RequirementResultService(prisma);

    const requirementResults = await service.findManyForResult(result.id);
    expect(requirementResults).toHaveLength(3);
  });

  it("can create an requirement result", async () => {
    const prisma = getPrismaService();

    const requirement = await prisma.requirement.create({ data: Factory.build<RequirementData>(REQUIREMENT) });
    const result = await prisma.codeLevelResult.create({
      data: Factory.build<CodeLevelResultData>(CODE_LEVEL_RESULT, { status: ResultStatus.SUCCESS }),
    });

    const service = new RequirementResultService(prisma);
    const requirementResult = await service.create(result.id, requirement.id, RequirementStatus.SUCCESS);

    expect(requirementResult).toBeTruthy();
    expect(requirementResult.result).toBe(RequirementStatus.SUCCESS);
    expect(requirementResult.requirementId).toBe(requirement.id);
  });
});
