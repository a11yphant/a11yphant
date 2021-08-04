import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";
import faker from "faker";

import { LevelFactory } from "./level.factory";

describe("level database factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a level record with the default options", async () => {
    const prisma = getPrismaService();

    const level = await prisma.level.create({
      data: LevelFactory.build(),
    });

    expect(level).toBeTruthy();
  });

  it("can create a level record with tasks", async () => {
    const prisma = getPrismaService();

    const level = await prisma.level.create({
      data: LevelFactory.build({}, { numberOfTasks: 2 }),
      include: {
        tasks: true,
      },
    });

    expect(level.tasks).toHaveLength(2);
  });

  it("can create a level record with requirements", async () => {
    const prisma = getPrismaService();

    const level = await prisma.level.create({
      data: LevelFactory.build({}, { numberOfRequirements: 2 }),
      include: {
        requirements: true,
      },
    });

    expect(level.requirements).toHaveLength(2);
  });

  it("does not create a challenge when a challenge id is passed", () => {
    const level = LevelFactory.build({ challengeId: faker.datatype.uuid() });

    expect(level.challenge).toBeUndefined();
  });
});
