import { createMock } from "@golevelup/ts-jest";
import { HintFactory } from "@tests/support/factories/models/hint.factory";
import { TaskFactory } from "@tests/support/factories/models/task.factory";

import { HintService } from "@/challenge/hint.service";
import { TaskResolver } from "@/challenge/task.resolver";

describe("task resolver", () => {
  it("resolves the hints for a task", async () => {
    const hints = [HintFactory.build(), HintFactory.build()];
    const task = TaskFactory.build();
    const findForTask = jest.fn().mockResolvedValue(hints);

    const resolver = new TaskResolver(
      createMock<HintService>({
        findForTask,
      }),
    );
    const resolvedTasks = await resolver.hints(task);

    expect(resolvedTasks).toBeTruthy();
    expect(findForTask).toHaveBeenCalledWith(task.id);
  });
});
