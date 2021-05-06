import { createMock } from "@golevelup/ts-jest";

import { LevelResolver } from "../../src/challenge/level.resolver";
import { LevelService } from "../../src/challenge/level.service";
import { Requirement } from "../../src/challenge/models/requirement.model";
import { RequirementService } from "../../src/challenge/requirement.service";
import { TaskService } from "../../src/challenge/task.service";
import { LevelFactory } from "../factories/models/level.factory";
import { RequirementFactory } from "../factories/models/requirement.factory";
import { TaskFactory } from "../factories/models/task.factory";

describe("level resolver", () => {
  it("resolves a level by challenge slug and index", async () => {
    const findOneForChallengeAtIndex = jest.fn().mockResolvedValue(LevelFactory.build({ id: "second-id" }));
    const resolver = new LevelResolver(
      createMock<LevelService>({
        findOneForChallengeAtIndex,
      }),
      createMock<RequirementService>(),
      createMock<TaskService>(),
    );

    expect(await resolver.levelByChallengeSlug({ challengeSlug: "level", nth: 2 })).toHaveProperty("id", "second-id");
    expect(findOneForChallengeAtIndex).toHaveBeenCalledWith("level", 1);
  });

  it("resolves the requirements for a level", async () => {
    const resolver = new LevelResolver(
      createMock<LevelService>(),
      createMock<RequirementService>({
        findForLevel: jest
          .fn()
          .mockResolvedValue([
            new Requirement({ id: "uuid-1", title: "Requirement 1", description: "A helpful message" }),
            new Requirement({ id: "uuid-2", title: "Requirement 2", description: "A helpful message" }),
          ]),
      }),
      createMock<TaskService>(),
    );

    expect((await resolver.requirements(LevelFactory.build())).length).toEqual(2);
  });

  it("resolves the tasks for a level", async () => {
    const tasks = [TaskFactory.build(), TaskFactory.build()];

    const resolver = new LevelResolver(
      createMock<LevelService>(),
      createMock<RequirementService>(),
      createMock<TaskService>({
        findForLevel: jest.fn().mockResolvedValue(tasks),
      }),
    );

    expect((await resolver.tasks(LevelFactory.build())).length).toEqual(tasks.length);
  });

  it("resolves the requirements for a level", async () => {
    const requirements = [RequirementFactory.build(), RequirementFactory.build()];

    const resolver = new LevelResolver(
      createMock<LevelService>(),
      createMock<RequirementService>({
        findForLevel: jest.fn().mockResolvedValue(requirements),
      }),
      createMock<TaskService>(),
    );

    expect((await resolver.requirements(LevelFactory.build())).length).toEqual(requirements.length);
  });
});
