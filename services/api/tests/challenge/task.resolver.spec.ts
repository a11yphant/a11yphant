import { createMock } from "@golevelup/ts-jest";

import { HintService } from "../../src/challenge/hint.service";
import { TaskResolver } from "../../src/challenge/task.resolver";
import { HintFactory } from "../factories/models/hint.factory";
import { TaskFactory } from "../factories/models/task.factory";

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
