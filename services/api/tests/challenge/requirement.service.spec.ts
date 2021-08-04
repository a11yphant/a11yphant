import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { LevelFactory } from "@tests/factories/database/level.factory";
import { useDatabase } from "@tests/helpers";

import { RequirementService } from "@/challenge/requirement.service";

describe("requirement service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  it("can get requirements for a level", async () => {
    const prisma = getPrismaService();
    const service = new RequirementService(prisma);

    const { id: levelId } = await prisma.level.create({
      data: LevelFactory.build({}, { numberOfRequirements: 2 }),
    });

    expect((await service.findForLevel(levelId)).length).toEqual(2);
  });
});
