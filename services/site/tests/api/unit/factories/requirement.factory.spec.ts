/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { Factory, REQUIREMENT, RequirementData } from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";

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
