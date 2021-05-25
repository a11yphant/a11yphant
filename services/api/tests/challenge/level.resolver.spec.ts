import { createMock } from "@golevelup/ts-jest";
import { LevelFactory } from "@tests/factories/models/level.factory";
import { RequirementFactory } from "@tests/factories/models/requirement.factory";
import { SubmissionFactory } from "@tests/factories/models/submission.factory";
import { TaskFactory } from "@tests/factories/models/task.factory";

import { LevelResolver } from "@/challenge/level.resolver";
import { LevelService } from "@/challenge/level.service";
import { Requirement } from "@/challenge/models/requirement.model";
import { RequirementService } from "@/challenge/requirement.service";
import { TaskService } from "@/challenge/task.service";
import { SubmissionService } from "@/submission/submission.service";

describe("level resolver", () => {
  it("resolves a level by challenge slug and index", async () => {
    const findOneForChallengeAtIndex = jest.fn().mockResolvedValue(LevelFactory.build({ id: "second-id" }));
    const resolver = new LevelResolver(
      createMock<LevelService>({
        findOneForChallengeAtIndex,
      }),
      createMock<RequirementService>(),
      createMock<TaskService>(),
      createMock<SubmissionService>(),
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
      createMock<SubmissionService>(),
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
      createMock<SubmissionService>(),
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
      createMock<SubmissionService>(),
    );

    expect((await resolver.requirements(LevelFactory.build())).length).toEqual(requirements.length);
  });

  it("resolves the last submission for a level", async () => {
    const submission = SubmissionFactory.build();

    const resolver = new LevelResolver(
      createMock<LevelService>(),
      createMock<RequirementService>(),
      createMock<TaskService>(),
      createMock<SubmissionService>({
        findLastForUserAndLevel: jest.fn().mockResolvedValue(submission),
      }),
    );

    const fetchedSubmission = await resolver.lastSubmission(LevelFactory.build(), { userId: "userid" });

    expect(fetchedSubmission.id).toBe(submission.id);
  });
});
