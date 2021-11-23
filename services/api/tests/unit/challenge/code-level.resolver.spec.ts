import { createMock } from "@golevelup/ts-jest";
import { CodeLevelFactory } from "@tests/support/factories/models/code-level.factory";
import { CodeLevelSubmissionFactory } from "@tests/support/factories/models/code-level-submission.factory";
import { RequirementFactory } from "@tests/support/factories/models/requirement.factory";
import { TaskFactory } from "@tests/support/factories/models/task.factory";

import { CodeLevelResolver } from "@/challenge/code-level.resolver";
import { LevelStatus } from "@/challenge/enums/level-status.enum";
import { LevelService } from "@/challenge/level.service";
import { Requirement } from "@/challenge/models/requirement.model";
import { RequirementService } from "@/challenge/requirement.service";
import { TaskService } from "@/challenge/task.service";
import { CodeLevelSubmissionService } from "@/submission/services/code-level-submission.service";

describe("code level resolver", () => {
  it("resolves the requirements for a level", async () => {
    const resolver = new CodeLevelResolver(
      createMock<RequirementService>({
        findForLevel: jest
          .fn()
          .mockResolvedValue([
            new Requirement({ id: "uuid-1", title: "Requirement 1", description: "A helpful message" }),
            new Requirement({ id: "uuid-2", title: "Requirement 2", description: "A helpful message" }),
          ]),
      }),
      createMock<TaskService>(),
      createMock<CodeLevelSubmissionService>(),
      createMock<LevelService>(),
    );

    expect((await resolver.requirements(CodeLevelFactory.build())).length).toEqual(2);
  });

  it("resolves the tasks for a level", async () => {
    const tasks = [TaskFactory.build(), TaskFactory.build()];

    const resolver = new CodeLevelResolver(
      createMock<RequirementService>(),
      createMock<TaskService>({
        findForLevel: jest.fn().mockResolvedValue(tasks),
      }),
      createMock<CodeLevelSubmissionService>(),
      createMock<LevelService>(),
    );

    expect((await resolver.tasks(CodeLevelFactory.build())).length).toEqual(tasks.length);
  });

  it("resolves the requirements for a level", async () => {
    const requirements = [RequirementFactory.build(), RequirementFactory.build()];

    const resolver = new CodeLevelResolver(
      createMock<RequirementService>({
        findForLevel: jest.fn().mockResolvedValue(requirements),
      }),
      createMock<TaskService>(),
      createMock<CodeLevelSubmissionService>(),
      createMock<LevelService>(),
    );

    expect((await resolver.requirements(CodeLevelFactory.build())).length).toEqual(requirements.length);
  });

  it("resolves the last submission for a level", async () => {
    const submission = CodeLevelSubmissionFactory.build();

    const resolver = new CodeLevelResolver(
      createMock<RequirementService>(),
      createMock<TaskService>(),
      createMock<CodeLevelSubmissionService>({
        findLastForUserAndLevel: jest.fn().mockResolvedValue(submission),
      }),
      createMock<LevelService>(),
    );

    const fetchedSubmission = await resolver.lastSubmission(CodeLevelFactory.build(), { userId: "userid" });

    expect(fetchedSubmission.id).toBe(submission.id);
  });

  it("resolves the last submission for a level", async () => {
    const submission = CodeLevelSubmissionFactory.build();

    const resolver = new CodeLevelResolver(
      createMock<RequirementService>(),
      createMock<TaskService>(),
      createMock<CodeLevelSubmissionService>({
        findLastForUserAndLevel: jest.fn().mockResolvedValue(submission),
      }),
      createMock<LevelService>(),
    );

    const fetchedSubmission = await resolver.lastSubmission(CodeLevelFactory.build(), { userId: "userid" });

    expect(fetchedSubmission.id).toBe(submission.id);
  });

  it("resolves out the status of a level", async () => {
    const resolver = new CodeLevelResolver(
      createMock<RequirementService>(),
      createMock<TaskService>(),
      createMock<CodeLevelSubmissionService>(),
      createMock<LevelService>({
        findStatusForCodeLevel: jest.fn().mockResolvedValue(LevelStatus.OPEN),
      }),
    );
    const status = await resolver.status(CodeLevelFactory.build(), { userId: "userid" });

    expect(status).toBe(LevelStatus.OPEN);
  });
});