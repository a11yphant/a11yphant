/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { CODE_LEVEL, CodeLevelData, TASK, TaskData } from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";
import { Factory } from "rosie";

import { TaskService } from "@/challenge/task.service";

describe("task service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  describe("findForLevel", () => {
    it("returns the tasks for the given level id", async () => {
      const prisma = getPrismaService();

      const { id: levelId } = await prisma.codeLevel.create({ data: Factory.build<CodeLevelData>(CODE_LEVEL) });

      await prisma.task.create({
        data: Factory.build<TaskData>(TASK, { levelId }),
      });

      const service = new TaskService(prisma);

      const tasks = await service.findForLevel(levelId);
      expect(tasks).toBeTruthy();
      expect(tasks.length).toEqual(1);
    });
  });
});
