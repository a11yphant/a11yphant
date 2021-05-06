import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { RequirementService } from "../../src/challenge/requirement.service";
import { ChallengeFactory } from "../factories/database/challenge.factory";
import { LevelFactory } from "../factories/database/level.factory";
import { RequirementFactory } from "../factories/database/requirement.factory";
import { useDatabase } from "../helpers";

describe("requirement service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  it("can get requirements for a level", async () => {
    const prisma = getPrismaService();
    const service = new RequirementService(prisma);

    const { id: challengeId } = await prisma.challenge.create({
      data: ChallengeFactory.build(),
    });

    const { id: levelId } = await prisma.level.create({
      data: LevelFactory.build({ challengeId }),
    });

    const requirements = [
      await prisma.requirement.create({ data: RequirementFactory.build({ levelId }) }),
      await prisma.requirement.create({ data: RequirementFactory.build({ levelId }) }),
    ];

    expect((await service.findForLevel(levelId)).length).toEqual(requirements.length);
  });
});
