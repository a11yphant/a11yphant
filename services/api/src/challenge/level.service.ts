import { Injectable } from "@nestjs/common";
import { CodeLevel, QuizLevel } from "@prisma/client";

import { ResultStatus } from "@/submission/graphql/models/result-status.enum";

import { PrismaService } from "../prisma/prisma.service";
import { LevelStatus } from "./enums/level-status.enum";
import { Code } from "./models/code.model";
import { CodeLevel as CodeLevelModel } from "./models/code-level.model";
import { Level } from "./models/level.model";
import { QuizLevel as QuizLevelModel } from "./models/quiz-level.model";

@Injectable()
export class LevelService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<Level> {
    const level = await this.prisma.codeLevel.findUnique({
      where: { id },
    });

    return level ? LevelService.createCodeLevelModelFromDatabaseRecord(level) : null;
  }

  async findForChallenge(challengeId: string): Promise<Level[]> {
    const [codeLevelsRecords, quizLevelsRecords] = await Promise.all([
      this.prisma.codeLevel.findMany({
        where: {
          challengeId,
        },
        orderBy: {
          order: "asc",
        },
      }),
      this.prisma.quizLevel.findMany({
        where: {
          challengeId,
        },
        orderBy: {
          order: "asc",
        },
      }),
    ]);

    const codeLevels = codeLevelsRecords.map(LevelService.createCodeLevelModelFromDatabaseRecord);
    const quizLevels = quizLevelsRecords.map(LevelService.createQuizLevelModelFromDatabaseRecord);

    return [...codeLevels, ...quizLevels].sort((a, b) => a.order - b.order);
  }

  async findOneForChallengeAtIndex(challengeSlug: string, index: number): Promise<Level> {
    const codeLevelRecords = await this.prisma.codeLevel.findMany({
      where: {
        challenge: {
          slug: challengeSlug,
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    const quizLevelRecords = await this.prisma.quizLevel.findMany({
      where: {
        challenge: {
          slug: challengeSlug,
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    const codeLevels = codeLevelRecords.map(LevelService.createCodeLevelModelFromDatabaseRecord);
    const quizLevels = quizLevelRecords.map(LevelService.createQuizLevelModelFromDatabaseRecord);

    const levels = [...codeLevels, ...quizLevels].sort((a, b) => a.order - b.order);
    return levels[index] || null;
  }

  async getNumberOfLevelsForChallenge(challengeId: string): Promise<number> {
    const counts = await Promise.all([
      this.prisma.codeLevel.count({
        where: {
          challengeId,
        },
      }),
      this.prisma.quizLevel.count({
        where: {
          challengeId,
        },
      }),
    ]);

    return counts.reduce((acc, count) => acc + count, 0);
  }

  async findStatusForCodeLevel(levelId: string, userId: string): Promise<LevelStatus> {
    const submissionCount = await this.prisma.codeLevelSubmission.count({
      where: {
        userId,
        levelId,
      },
    });

    if (submissionCount === 0) return LevelStatus.OPEN;

    const successfulSubmissionsCount = await this.prisma.codeLevelSubmission.count({
      where: {
        userId,
        levelId,
        result: {
          status: ResultStatus.SUCCESS,
        },
      },
    });

    if (successfulSubmissionsCount > 0) return LevelStatus.FINISHED;

    return LevelStatus.IN_PROGRESS;
  }

  async findStatusForQuizLevel(levelId: string, userId: string): Promise<LevelStatus> {
    const submissionCount = await this.prisma.quizLevelSubmission.count({
      where: {
        userId,
        levelId,
      },
    });

    if (submissionCount === 0) return LevelStatus.OPEN;

    const successfulSubmissionsCount = await this.prisma.quizLevelSubmission.count({
      where: {
        userId,
        levelId,
        result: {
          status: ResultStatus.SUCCESS,
        },
      },
    });

    if (successfulSubmissionsCount > 0) return LevelStatus.FINISHED;

    return LevelStatus.IN_PROGRESS;
  }

  async isQuizOnly(challengeId: string): Promise<boolean> {
    const count = await this.prisma.codeLevel.count({
      where: {
        challengeId,
      },
    });

    return count === 0;
  }

  public static createQuizLevelModelFromDatabaseRecord(record: QuizLevel): QuizLevelModel {
    const level = new QuizLevelModel({ ...record });

    return level;
  }

  public static createCodeLevelModelFromDatabaseRecord(record: CodeLevel): CodeLevelModel {
    const level = new CodeLevelModel({ ...record });

    if (!record.html && !record.css && !record.js) {
      return level;
    }

    level.code = new Code({
      html: record.html,
      css: record.css,
      js: record.js,
    });

    return level;
  }
}
