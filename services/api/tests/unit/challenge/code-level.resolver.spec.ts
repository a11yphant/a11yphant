import { createMock } from "@golevelup/ts-jest";
import { CodeLevelFactory } from "@tests/support/factories/models/code-level.factory";
import { CodeLevelSubmissionFactory } from "@tests/support/factories/models/code-level-submission.factory";

import { SessionToken } from "@/authentication/interfaces/session-token.interface";
import { CodeLevelResolver } from "@/challenge/code-level.resolver";
import { LevelStatus } from "@/challenge/enums/level-status.enum";
import { LevelService } from "@/challenge/level.service";
import { RequirementService } from "@/challenge/requirement.service";
import { TaskService } from "@/challenge/task.service";
import { CodeLevelSubmissionService } from "@/submission/services/code-level-submission.service";

function createCodeLevelResolver(
  partials: {
    levelService?: Partial<LevelService>;
    requirementService?: Partial<RequirementService>;
    taskService?: Partial<TaskService>;
    codeLevelSubmissionService?: Partial<CodeLevelSubmissionService>;
  } = {},
): CodeLevelResolver {
  const levelService = createMock<LevelService>(partials.levelService);
  const requirementService = createMock<RequirementService>(partials.requirementService);
  const taskService = createMock<TaskService>(partials.taskService);
  const codeLevelSubmissionService = createMock<CodeLevelSubmissionService>(partials.codeLevelSubmissionService);

  return new CodeLevelResolver(requirementService, taskService, codeLevelSubmissionService, levelService);
}

describe("code level resolver", () => {
  const level = CodeLevelFactory.build();
  const sessionToken: SessionToken = { userId: "userid" };

  it("resolves the requirements for a level", async () => {
    const findForLevel = jest.fn().mockResolvedValue([]);

    const resolver = createCodeLevelResolver({ requirementService: { findForLevel } });
    const resolvedRequirements = await resolver.requirements(level);

    expect(resolvedRequirements).toBeTruthy();
    expect(findForLevel).toHaveBeenCalledWith(level.id);
  });

  it("resolves the tasks for a level", async () => {
    const findForLevel = jest.fn().mockResolvedValue([]);

    const resolver = createCodeLevelResolver({ taskService: { findForLevel } });
    const resolvedTasks = await resolver.tasks(level);

    expect(resolvedTasks).toBeTruthy();
    expect(findForLevel).toHaveBeenCalledWith(level.id);
  });

  it("resolves the requirements for a level", async () => {
    const findForLevel = jest.fn().mockResolvedValue([]);

    const resolver = createCodeLevelResolver({ requirementService: { findForLevel } });
    const resolvedLevels = await resolver.requirements(level);

    expect(resolvedLevels).toBeTruthy();
    expect(findForLevel).toHaveBeenCalledWith(level.id);
  });

  it("resolves the last submission for a level", async () => {
    const submission = CodeLevelSubmissionFactory.build();
    const findLastForUserAndLevel = jest.fn().mockResolvedValue(submission);

    const resolver = createCodeLevelResolver({ codeLevelSubmissionService: { findLastForUserAndLevel } });
    const resolvedSubmission = await resolver.lastSubmission(level, sessionToken);

    expect(resolvedSubmission).toBeTruthy();
    expect(findLastForUserAndLevel).toHaveBeenCalledWith(sessionToken.userId, level.id);
  });

  it("resolves the last submission for a level", async () => {
    const submission = CodeLevelSubmissionFactory.build();
    const findLastForUserAndLevel = jest.fn().mockResolvedValue(submission);

    const resolver = createCodeLevelResolver({ codeLevelSubmissionService: { findLastForUserAndLevel } });
    const resolvedSubmission = await resolver.lastSubmission(level, sessionToken);

    expect(resolvedSubmission).toBeTruthy();
    expect(findLastForUserAndLevel).toHaveBeenCalledWith(sessionToken.userId, level.id);
  });

  it("resolves out the status of a level", async () => {
    const findStatusForCodeLevel = jest.fn().mockResolvedValue(LevelStatus.OPEN);

    const resolver = createCodeLevelResolver({ levelService: { findStatusForCodeLevel } });
    const status = await resolver.status(level, sessionToken);

    expect(status).toBeDefined();
    expect(findStatusForCodeLevel).toHaveBeenCalledWith(level.id, sessionToken.userId);
  });
});
