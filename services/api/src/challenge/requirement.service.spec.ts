import { useDatabase } from "@a11y-challenges/prisma";
import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { RequirementService } from "./requirement.service";

describe("requirement service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  it("can get requirements for a level", async () => {
    const prisma = getPrismaService();
    const service = new RequirementService(prisma);
    const level = await prisma.level.create({
      data: {
        instructions: "",
        tldr: "",
        challenge: { create: { name: "level" } },
        requirements: { create: [{ title: "1" }, { title: "2" }] },
      },
    });

    expect((await service.findForLevel(level.id)).length).toEqual(2);
  });
});
