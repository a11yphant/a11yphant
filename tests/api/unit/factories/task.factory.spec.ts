/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { Factory, TASK, TaskData } from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";

describe("task factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a task record with default options", async () => {
    const prisma = getPrismaService();

    const task = await prisma.task.create({
      data: Factory.build<TaskData>(TASK),
    });

    expect(task).toBeTruthy();
  });

  it("can create a task record with hints", async () => {
    const prisma = getPrismaService();

    const task = await prisma.task.create({
      data: Factory.build<TaskData>(TASK, {}, { numberOfHints: 2 }),
      select: {
        hints: true,
      },
    });

    expect(task.hints).toHaveLength(2);
  });
});
