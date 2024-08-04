/**
 * @jest-environment node
 */

import { faker } from "@faker-js/faker";
import { createMock, PartialFuncReturn } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import {
  CODE_LEVEL,
  CODE_LEVEL_SUBMISSION,
  CodeLevelData,
  CodeLevelSubmissionData,
  Factory,
  USER,
  UserData,
} from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";

import { PrismaService } from "@/prisma/prisma.service";
import { SubmissionNotFoundException } from "@/submission/exceptions/submission-not-found.exception";
import { Result } from "@/submission/graphql/models/result.model";
import { ResultStatus } from "@/submission/graphql/models/result-status.enum";
import { CheckSubmissionService } from "@/submission/services/check-submission.service";
import { CodeLevelResultService } from "@/submission/services/code-level-result.service";
import { CodeLevelSubmissionService } from "@/submission/services/code-level-submission.service";
import { RequirementResultService } from "@/submission/services/requirement-result.service";

describe("code level submission service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  describe("findOne", () => {
    it("finds a submission to a given id", async () => {
      const html = "<div>hello</div>";

      const prisma = getPrismaService();
      const service = new CodeLevelSubmissionService(
        prisma,
        createMock<CheckSubmissionService>(),
        createMock<CodeLevelResultService>(),
        createMock<RequirementResultService>(),
        createMock<Logger>(),
      );

      const { id } = await prisma.codeLevelSubmission.create({
        data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, { html }),
      });

      const submission = await service.findOne(id);

      expect(submission).toBeTruthy();
      expect(submission.html).toBe(html);
    });
  });

  describe("findLastForUserAndLevel", () => {
    it("finds the last submission for user and level", async () => {
      const html = "<h1>a11yphant</h1>";

      const prisma = getPrismaService();
      const service = new CodeLevelSubmissionService(
        prisma,
        createMock<CheckSubmissionService>(),
        createMock<CodeLevelResultService>(),
        createMock<RequirementResultService>(),
        createMock<Logger>(),
      );

      const {
        id: submissionId,
        userId,
        levelId,
      } = await prisma.codeLevelSubmission.create({
        data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION, { html }),
        include: {
          level: true,
        },
      });

      const submission = await service.findLastForUserAndLevel(userId, levelId);

      expect(submission).toBeTruthy();
      expect(submission.html).toBe(html);
      expect(submission.id).toBe(submissionId);
    });
  });

  describe("create", () => {
    it("can save a submission to a given level", async () => {
      const html = "<div>good morning :)</div>";

      const prisma = getPrismaService();
      const service = new CodeLevelSubmissionService(
        prisma,
        createMock<CheckSubmissionService>(),
        createMock<CodeLevelResultService>(),
        createMock<RequirementResultService>(),
        createMock<Logger>(),
      );

      const { id: userId } = await prisma.user.create({
        data: Factory.build<UserData>(USER),
      });

      const { id: levelId } = await prisma.codeLevel.create({
        data: Factory.build<CodeLevelData>(CODE_LEVEL),
      });

      const createdSubmission = await service.create({
        levelId,
        userId,
        html,
        css: null,
        js: null,
      });

      expect(createdSubmission).toBeTruthy();
      expect(createdSubmission.html).toBe(html);

      const queriedSubmission = await prisma.codeLevelSubmission.findUnique({
        where: {
          id: createdSubmission.id,
        },
        include: { result: true },
      });

      expect(queriedSubmission).toBeTruthy();
      expect(queriedSubmission.html).toBe(html);
    });

    it("throws error if no level is found for id", async () => {
      const prisma = getPrismaService();
      const service = new CodeLevelSubmissionService(
        prisma,
        createMock<CheckSubmissionService>(),
        createMock<CodeLevelResultService>(),
        createMock<RequirementResultService>(),
        createMock<Logger>(),
      );

      const { id: userId } = await prisma.user.create({
        data: Factory.build<UserData>(USER),
      });

      expect(async () =>
        service.create({
          levelId: "badId",
          userId,
        }),
      ).rejects.toBeTruthy();
    });
  });

  describe("update", () => {
    it("can update a submission to a given level", async () => {
      const html = "<div>good morning :)</div>";

      const prisma = getPrismaService();
      const service = new CodeLevelSubmissionService(
        prisma,
        createMock<CheckSubmissionService>(),
        createMock<CodeLevelResultService>(),
        createMock<RequirementResultService>(),
        createMock<Logger>(),
      );

      const { id: userId } = await prisma.user.create({
        data: Factory.build<UserData>(USER),
      });

      const { id: levelId } = await prisma.codeLevel.create({
        data: Factory.build<CodeLevelData>(CODE_LEVEL),
      });

      const { id: submissionId } = await prisma.codeLevelSubmission.create({
        data: Factory.build<CodeLevelSubmissionData>(CODE_LEVEL_SUBMISSION),
      });

      const updatedSubmission = await service.update({
        id: submissionId,
        levelId,
        userId,
        html,
        css: null,
        js: null,
      });

      const queriedSubmission = await prisma.codeLevelSubmission.findUnique({
        where: {
          id: updatedSubmission.id,
        },
      });

      expect(updatedSubmission).toBeTruthy();
      expect(updatedSubmission.html).toBe(html);
      expect(queriedSubmission).toBeTruthy();
      expect(queriedSubmission.html).toBe(html);
    });

    it("throws error if no level is found for id", async () => {
      const prisma = getPrismaService();
      const service = new CodeLevelSubmissionService(
        prisma,
        createMock<CheckSubmissionService>(),
        createMock<CodeLevelResultService>(),
        createMock<RequirementResultService>(),
        createMock<Logger>(),
      );

      const { id: userId } = await prisma.user.create({
        data: Factory.build<UserData>(USER),
      });

      const { id: levelId } = await prisma.codeLevel.create({
        data: Factory.build<CodeLevelData>(CODE_LEVEL),
      });

      expect(async () =>
        service.update({
          id: faker.string.uuid(),
          levelId,
          userId,
        }),
      ).rejects.toThrowError(SubmissionNotFoundException);
    });
  });

  describe("requestCheck", () => {
    const requirement = { id: "some-uuid", rule: { key: "test-key" }, options: { selector: "ul > li" } };

    const submission = {
      id: "uuid",
      html: "html",
      css: "css",
      js: "js",
      level: { requirements: [requirement] },
    };

    const getSubmissionService = (partials?: {
      prismaService?: PartialFuncReturn<PrismaService>;
      checkSubmissionService?: PartialFuncReturn<CheckSubmissionService>;
      codeLevelResultService?: PartialFuncReturn<CodeLevelResultService>;
      requriementResultService?: PartialFuncReturn<RequirementResultService>;
      logger?: PartialFuncReturn<Logger>;
    }): CodeLevelSubmissionService => {
      return new CodeLevelSubmissionService(
        createMock<PrismaService>({
          codeLevelResult: {
            count: jest.fn().mockResolvedValue(0),
          },
          codeLevelSubmission: {
            update: jest.fn(),
            findUnique: jest.fn().mockResolvedValue(submission),
          },
          ...partials.prismaService,
        }),
        createMock<CheckSubmissionService>(partials.checkSubmissionService),
        createMock<CodeLevelResultService>(partials.codeLevelResultService),
        createMock<RequirementResultService>(partials.requriementResultService),
        createMock<Logger>(partials.logger),
      );
    };

    it("calls the submission checker correctly", async () => {
      const check = jest.fn().mockResolvedValue({ ruleCheckResults: [{ id: "someId", status: "success" }] });

      const service = getSubmissionService({
        checkSubmissionService: {
          check,
        },
      });

      await service.requestCheck("uuid");

      expect(check).toHaveBeenCalledWith(
        submission,
        expect.arrayContaining([
          expect.objectContaining({
            id: requirement.id,
            key: requirement.rule.key,
            options: expect.anything(),
          }),
        ]),
      );
    });

    it("returns a successful result", async () => {
      const resultId = "someResultId";
      const resultUpdate = jest.fn();

      const service = getSubmissionService({
        checkSubmissionService: {
          check: jest.fn().mockResolvedValue({ ruleCheckResults: [{ id: "someId", status: "success" }] }),
        },
        codeLevelResultService: {
          findOneForSubmission: jest.fn().mockResolvedValue(new Result({ id: resultId, submissionId: "someotherid", status: ResultStatus.PENDING })),
          update: resultUpdate,
        },
      });

      await service.requestCheck("uuid");
      expect(resultUpdate).toHaveBeenCalledWith(resultId, { status: ResultStatus.SUCCESS });
    });

    it("returns an error result", async () => {
      const resultId = "someResultId";
      const resultUpdate = jest.fn();

      const service = getSubmissionService({
        checkSubmissionService: {
          check: jest.fn().mockResolvedValue({ ruleCheckResults: [{ id: "someId", status: "failed" }] }),
        },
        codeLevelResultService: {
          findOneForSubmission: jest.fn().mockResolvedValue(new Result({ id: resultId, submissionId: "someotherid", status: ResultStatus.PENDING })),
          update: resultUpdate,
        },
      });

      await service.requestCheck("uuid");
      expect(resultUpdate).toHaveBeenCalledWith(resultId, { status: ResultStatus.FAIL });
    });

    it("creates the right amount of requirement results", async () => {
      const requirementResultCreate = jest.fn();

      const ruleCheckResults = [
        { id: "someId", status: "failed" },
        { id: "someId", status: "success" },
        { id: "someId", status: "success" },
      ];

      const service = getSubmissionService({
        checkSubmissionService: {
          check: jest.fn().mockResolvedValue({ ruleCheckResults }),
        },
        codeLevelResultService: {
          findOneForSubmission: jest
            .fn()
            .mockResolvedValue(new Result({ id: "resultId", submissionId: "someotherid", status: ResultStatus.PENDING })),
        },
        requriementResultService: {
          create: requirementResultCreate,
        },
      });

      await service.requestCheck("uuid");
      expect(requirementResultCreate).toHaveBeenCalledTimes(ruleCheckResults.length);
    });

    it("throws an exception if the submission already has a result", async () => {
      const service = getSubmissionService({
        prismaService: {
          codeLevelResult: {
            count: jest.fn().mockResolvedValue(1),
          },
        },
      });

      expect(async () => await service.requestCheck("uuid")).rejects.toBeTruthy();
    });
  });
});
