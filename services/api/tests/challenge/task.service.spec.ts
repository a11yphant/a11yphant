import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { LevelFactory } from "@tests/factories/database/level.factory";
import { TaskFactory } from "@tests/factories/database/task.factory";
import { useDatabase } from "@tests/helpers";

import { TaskService } from "@/challenge/task.service";

describe("task service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  describe("findForLevel", () => {
    it("returns the tasks for the given level id", async () => {
      const prisma = getPrismaService();

      const { id: levelId } = await prisma.level.create({ data: LevelFactory.build({}, { withChallenge: true }) });

      await prisma.task.create({
        data: TaskFactory.build({ levelId }),
      });

      const service = new TaskService(prisma);

      const tasks = await service.findForLevel(levelId);
      expect(tasks).toBeTruthy();
      expect(tasks.length).toEqual(1);
    });
  });
});
