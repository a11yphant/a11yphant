import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { REQUIREMENT } from "./constants";
import { Factory } from "./factory";
import { RequirementData } from "./types";

describe("requirement factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a requirement record with default options", async () => {
    const prisma = getPrismaService();

    const requirement = await prisma.requirement.create({
      data: Factory.build<RequirementData>(REQUIREMENT),
    });

    expect(requirement).toBeTruthy();
  });
});
