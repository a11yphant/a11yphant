import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { Factory, LEVEL, LevelData } from "@tests/factories/database";
import { useDatabase } from "@tests/helpers";

import { RequirementService } from "@/challenge/requirement.service";

describe("requirement service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  it("can get requirements for a level", async () => {
    const prisma = getPrismaService();
    const service = new RequirementService(prisma);

    const { id: levelId } = await prisma.codeLevel.create({
      data: Factory.build<LevelData>(LEVEL, {}, { numberOfRequirements: 2 }),
    });

    expect((await service.findForLevel(levelId)).length).toEqual(2);
  });
});
