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
    const record = await this.prisma.codeLevel.findFirst({
      where: {
        challenge: {
          slug: challengeSlug,
        },
      },
      orderBy: {
        order: "asc",
      },
      skip: index,
    });

    return record ? LevelService.createCodeLevelModelFromDatabaseRecord(record) : null;
  }

  async getNumberOfLevelsForChallenge(challengeId: string): Promise<number> {
    return this.prisma.codeLevel.count({ where: { challengeId } });
  }

  async findStatusForUserAndLevel(userId: string, levelId: string): Promise<LevelStatus> {
    const submissionCount = await this.prisma.submission.count({
      where: {
        userId,
        levelId,
      },
    });

    if (submissionCount === 0) return LevelStatus.OPEN;

    const successfulSubmissionsCount = await this.prisma.submission.count({
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
