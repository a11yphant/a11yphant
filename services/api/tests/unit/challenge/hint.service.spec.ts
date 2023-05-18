import { faker } from "@faker-js/faker";
import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { Factory, HINT, HintData, TASK, TaskData } from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";

import { HintService } from "@/challenge/hint.service";

describe("hint service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  it("can get hints for a task", async () => {
    const prisma = getPrismaService();
    const service = new HintService(prisma);
    const count = 2;

    const task = await prisma.task.create({ data: Factory.build<TaskData>(TASK, {}, { numberOfHints: count }) });

    expect((await service.findForTask(task.id)).length).toEqual(count);
  });

  it("can get a hint by id", async () => {
    const prisma = getPrismaService();
    const service = new HintService(prisma);
    const hint = await prisma.hint.create({
      data: Factory.build<HintData>(HINT),
    });

    expect(await service.findOneById(hint.id)).toHaveProperty("id", hint.id);
  });

  it("returns null when trying to get an not existing hint", async () => {
    const prisma = getPrismaService();
    const service = new HintService(prisma);

    expect(await service.findOneById(faker.string.uuid())).toBeFalsy();
  });
});
