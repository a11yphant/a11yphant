import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { ResourceService } from "../../src/challenge/resource.service";
import { useDatabase } from "../helpers";

describe("resource service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  it("can get resources for a level", async () => {
    const prisma = getPrismaService();
    const service = new ResourceService(prisma);
    const level = await prisma.level.create({
      data: {
        instructions: "",
        tldr: "",
        challenge: { create: { name: "level", slug: "level", difficulty: 0 } },
        resources: {
          create: [
            { title: "1", link: "http://1.com" },
            { title: "2", link: "http://2.com" },
          ],
        },
      },
    });

    expect((await service.findForLevel(level.id)).length).toEqual(2);
  });
});
