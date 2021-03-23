import { useDatabase } from "@a11y-challenges/prisma";
import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { HintService } from "./hint.service";

describe("hint service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  it("can get hints for a level", async () => {
    const prisma = getPrismaService();
    const service = new HintService(prisma);
    const level = await prisma.level.create({
      data: {
        instructions: "",
        tldr: "",
        challenge: { create: { name: "level", slug: "slug" } },
        hints: { create: [{ content: "1" }, { content: "2" }] },
      },
    });

    expect((await service.findForLevel(level.id)).length).toEqual(2);
  });

  it("can get a hint by id", async () => {
    const prisma = getPrismaService();
    const service = new HintService(prisma);
    const level = await prisma.level.create({
      data: {
        instructions: "",
        tldr: "",
        challenge: { create: { name: "level", slug: "slug" } },
        hints: { create: [{ content: "1" }, { content: "2" }] },
      },
      include: { hints: {} },
    });

    expect(await service.findOneById(level.hints[0].id)).toHaveProperty("id", level.hints[0].id);
  });

  it("returns null when trying to get an not existing hint", async () => {
    const prisma = getPrismaService();
    const service = new HintService(prisma);

    expect(await service.findOneById("asdf")).toBeFalsy();
  });
});
