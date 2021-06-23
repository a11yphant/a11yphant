import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { RequirementService } from "../../src/challenge/requirement.service";
import { LevelFactory } from "../factories/database/level.factory";
import { useDatabase } from "../helpers";

describe("requirement service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  it("can get requirements for a level", async () => {
    const prisma = getPrismaService();
    const service = new RequirementService(prisma);

    const { id: levelId } = await prisma.level.create({
      data: LevelFactory.build({}, { withChallenge: true, numberOfRequirements: 2 }),
    });

    expect((await service.findForLevel(levelId)).length).toEqual(2);
  });
});
