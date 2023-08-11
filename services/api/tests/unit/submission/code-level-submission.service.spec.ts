import { faker } from "@faker-js/faker";
import { createMock } from "@golevelup/ts-jest";
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
    it("emits a submission.created event when a new submission is created", async () => {
      const emit = jest.fn(() => ({ toPromise: jest.fn().mockResolvedValue(null) }));

      const submission = {
        id: "uuid",
        html: "html",
        css: "css",
        js: "js",
        level: { requirements: [{ id: "some-uuid", rule: { key: "test-key" }, options: { selector: "ul > li" } }] },
      };

      const service = new CodeLevelSubmissionService(
        createMock<PrismaService>({
          codeLevelResult: {
            count: jest.fn().mockResolvedValue(0),
          },
          codeLevelSubmission: {
            update: jest.fn().mockResolvedValue({ result: { status: ResultStatus.PENDING } }),
            findUnique: jest.fn().mockResolvedValue(submission),
          },
        }),
        createMock<CheckSubmissionService>(),
        createMock<CodeLevelResultService>(),
        createMock<RequirementResultService>(),
        createMock<Logger>(),
      );

      const result = await service.requestCheck("uuid");

      expect(result.status).toBe(ResultStatus.PENDING);
      expect(emit).toHaveBeenCalledWith(
        "submission.created",
        expect.objectContaining({
          submission: {
            id: submission.id,
            html: submission.html,
            css: submission.css,
            js: submission.js,
          },
          rules: expect.arrayContaining([
            expect.objectContaining({
              id: submission.level.requirements[0].id,
              key: submission.level.requirements[0].rule.key,
              options: submission.level.requirements[0].options,
            }),
          ]),
        }),
      );
    });

    it("throws an exception if the submission already has a result", async () => {
      const service = new CodeLevelSubmissionService(
        createMock<PrismaService>({
          codeLevelResult: {
            count: jest.fn().mockResolvedValue(1),
          },
        }),
        createMock<CheckSubmissionService>(),
        createMock<CodeLevelResultService>(),
        createMock<RequirementResultService>(),
        createMock<Logger>(),
      );

      expect(async () => await service.requestCheck("uuid")).rejects.toBeTruthy();
    });
  });
});
