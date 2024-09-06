import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/prisma/prisma.service";

import { ReferenceNotValidException } from "../exceptions/reference-not-valid.excpetion";
import { Result } from "../graphql/models/result.model";
import { ResultStatus } from "../graphql/models/result-status.enum";

@Injectable()
export class QuizLevelSubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(levelId: string, answers: string[], userId: string): Promise<string> {
    try {
      const submission = await this.prisma.quizLevelSubmission.create({
        data: {
          answers: {
            connect: answers.map((answer) => ({ id: answer })),
          },
          level: {
            connect: {
              id: levelId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return submission.id;
    } catch (error) {
      if (error.code === "P2025") {
        throw new ReferenceNotValidException();
      }

      throw error;
    }
  }

  async check(submissionId: string): Promise<Result> {
    const submission = await this.prisma.quizLevelSubmission.findUnique({
      where: {
        id: submissionId,
      },
      include: {
        answers: true,
        level: {
          include: {
            answerOptions: {
              where: {
                correct: true,
              },
            },
          },
        },
      },
    });

    const correctAnswers = submission.level.answerOptions.map((answer) => answer.id);
    const userAnswers = submission.answers.map((answer) => answer.id);

    const isCorrect = correctAnswers.every((answer) => userAnswers.includes(answer));

    const result = await this.prisma.quizLevelResult.create({
      data: {
        submission: {
          connect: {
            id: submissionId,
          },
        },
        status: isCorrect ? ResultStatus.SUCCESS : ResultStatus.FAIL,
      },
    });

    return {
      id: result.id,
      status: result.status,
      submissionId: result.submissionId,
    };
  }
}
