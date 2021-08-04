import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { HintFactory } from "@tests/factories/database/hint.factory";
import { TaskFactory } from "@tests/factories/database/task.factory";
import { useDatabase } from "@tests/helpers";
import faker from "faker";

import { HintService } from "@/challenge/hint.service";

describe("hint service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  it("can get hints for a task", async () => {
    const prisma = getPrismaService();
    const service = new HintService(prisma);
    const count = 2;

    const task = await prisma.task.create({ data: TaskFactory.build({}, { numberOfHints: count }) });

    expect((await service.findForTask(task.id)).length).toEqual(count);
  });

  it("can get a hint by id", async () => {
    const prisma = getPrismaService();
    const service = new HintService(prisma);
    const hint = await prisma.hint.create({
      data: HintFactory.build(),
    });

    expect(await service.findOneById(hint.id)).toHaveProperty("id", hint.id);
  });

  it("returns null when trying to get an not existing hint", async () => {
    const prisma = getPrismaService();
    const service = new HintService(prisma);

    expect(await service.findOneById(faker.datatype.uuid())).toBeFalsy();
  });
});
