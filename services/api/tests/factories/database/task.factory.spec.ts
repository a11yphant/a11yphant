import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { TaskFactory } from "./task.factory";

describe("task factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a task record with default options", async () => {
    const prisma = getPrismaService();

    const task = await prisma.task.create({
      data: TaskFactory.build(),
    });

    expect(task).toBeTruthy();
  });
});
