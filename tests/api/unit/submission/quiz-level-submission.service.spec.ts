/**
 * @jest-environment node
 */

import { faker } from "@faker-js/faker";
import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { QUIZ_LEVEL, QUIZ_LEVEL_SUBMISSION, QuizLevelData, QuizLevelSubmissionData, USER, UserData } from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";
import { Factory } from "rosie";

import { ReferenceNotValidException } from "@/submission/exceptions/reference-not-valid.excpetion";
import { ResultStatus } from "@/submission/graphql/models/result-status.enum";
import { QuizLevelSubmissionService } from "@/submission/services/quiz-level-submission.service";

describe("quiz level submission service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  describe("create", () => {
    it("can create a quiz level submission", async () => {
      const prisma = getPrismaService();

      const user = await prisma.user.create({
        data: Factory.build<UserData>(USER),
      });

      const level = await prisma.quizLevel.create({
        data: Factory.build<QuizLevelData>(QUIZ_LEVEL, {}, { numberOfAnswerOptions: 2 }),
        include: {
          answerOptions: true,
        },
      });

      const service = new QuizLevelSubmissionService(prisma);
      const submissionId = await service.create(
        level.id,
        level.answerOptions.map(({ id }) => id),
        user.id,
      );

      const submission = await prisma.quizLevelSubmission.findUnique({
        where: { id: submissionId },
        include: {
          answers: true,
        },
      });

      expect(submission.answers).toHaveLength(2);
    });

    it("throws an exception if the level id was not found", async () => {
      const prisma = getPrismaService();

      const service = new QuizLevelSubmissionService(prisma);

      await expect(() => service.create(faker.string.uuid(), [], faker.string.uuid())).rejects.toThrowError(ReferenceNotValidException);
    });
  });

  describe("check", () => {
    it("returns a successful result for a correctly answered question", async () => {
      const prisma = getPrismaService();
      const service = new QuizLevelSubmissionService(prisma);

      const level = await prisma.quizLevel.create({
        data: Factory.build<QuizLevelData>(QUIZ_LEVEL, {
          answerOptions: {
            create: [
              {
                text: "correct",
                correct: true,
              },

              {
                text: "incorrect",
                correct: false,
              },
            ],
          },
        }),
        include: {
          answerOptions: true,
        },
      });

      const submission = await prisma.quizLevelSubmission.create({
        data: Factory.build<QuizLevelSubmissionData>(QUIZ_LEVEL_SUBMISSION, {
          level: {
            connect: {
              id: level.id,
            },
          },
          answers: {
            connect: level.answerOptions.filter(({ correct }) => correct).map(({ id }) => ({ id })),
          },
        }),
      });

      const result = await service.check(submission.id);
      expect(result.status).toBe(ResultStatus.SUCCESS);
    });

    it("returns a fail result for a not correctly answered question", async () => {
      const prisma = getPrismaService();
      const service = new QuizLevelSubmissionService(prisma);

      const level = await prisma.quizLevel.create({
        data: Factory.build<QuizLevelData>(QUIZ_LEVEL, {
          answerOptions: {
            create: [
              {
                text: "correct",
                correct: true,
              },

              {
                text: "incorrect",
                correct: false,
              },
            ],
          },
        }),
        include: {
          answerOptions: true,
        },
      });

      const submission = await prisma.quizLevelSubmission.create({
        data: Factory.build<QuizLevelSubmissionData>(QUIZ_LEVEL_SUBMISSION, {
          level: {
            connect: {
              id: level.id,
            },
          },
          answers: {
            connect: level.answerOptions.filter(({ correct }) => !correct).map(({ id }) => ({ id })),
          },
        }),
      });

      const result = await service.check(submission.id);
      expect(result.status).toBe(ResultStatus.FAIL);
    });
  });
});
