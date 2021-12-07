import { createMock } from "@golevelup/ts-jest";
import { HintFactory } from "@tests/support/factories/models/hint.factory";
import { TaskFactory } from "@tests/support/factories/models/task.factory";

import { HintService } from "@/challenge/hint.service";
import { TaskResolver } from "@/challenge/task.resolver";

describe("task resolver", () => {
  it("resolves the hints for a task", async () => {
    const hints = [HintFactory.build(), HintFactory.build()];

    const resolver = new TaskResolver(
      createMock<HintService>({
        findForTask: jest.fn().mockResolvedValue(hints),
      }),
    );

    expect((await resolver.hints(TaskFactory.build())).length).toEqual(hints.length);
  });
});
