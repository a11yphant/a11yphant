import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { RequirementFactory } from "@tests/factories/database/requirement.factory";
import { ResultFactory } from "@tests/factories/database/result.factory";
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

    const service = new RequirementResultService(prisma);

    const requirementResults = await service.findManyForResult(result.id);
    expect(requirementResults).toHaveLength(3);
  });

  it("can create an requirement result", async () => {
    const prisma = getPrismaService();

    const requirement = await prisma.requirement.create({ data: RequirementFactory.build() });
    const result = await prisma.result.create({ data: ResultFactory.build({ status: ResultStatus.SUCCESS }) });

    const service = new RequirementResultService(prisma);
    const requirementResult = await service.create(result.id, requirement.id, RequirementStatus.SUCCESS);

    expect(requirementResult).toBeTruthy();
    expect(requirementResult.result).toBe(RequirementStatus.SUCCESS);
    expect(requirementResult.requirementId).toBe(requirement.id);
  });
});
