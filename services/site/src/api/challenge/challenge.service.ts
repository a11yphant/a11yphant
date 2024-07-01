import { Injectable } from "@nestjs/common";
import { Challenge as ChallengeRecord, Prisma } from "@prisma/client";

import { ResultStatus } from "@/submission/graphql/models/result-status.enum";

import { PrismaService } from "../prisma/prisma.service";
import { ChallengesFilter } from "./arg-types/challenges.args";
import { ChallengeStatus } from "./enums/challenge-status";
import { Challenge } from "./models/challenge.model";

@Injectable()
export class ChallengeService {
  constructor(private prisma: PrismaService) {}

  public async findOne(id: string): Promise<Challenge> {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
    });

    return challenge ? ChallengeService.createModelFromDatabaseRecord(challenge) : null;
  }

  public async findAll(userId?: string, filter?: ChallengesFilter): Promise<Challenge[]> {
    const filterObject: Prisma.ChallengeFindManyArgs = { where: {}, orderBy: { order: "asc" } };

    let challenges: ChallengeRecord[];

    if (filter) {
      const { currentUserStatus, ...filterWithoutCurrentUserStatus } = filter;

      filterObject.where = { ...filterWithoutCurrentUserStatus };

      challenges = await this.prisma.challenge.findMany(filterObject);

      if (currentUserStatus !== undefined && userId) {
        challenges = await this.filterChallengeRecordsByStatus(challenges, userId, currentUserStatus);
      }
    } else {
      challenges = await this.prisma.challenge.findMany(filterObject);
    }

    return challenges.map((challenge) => ChallengeService.createModelFromDatabaseRecord(challenge));
  }

  async filterChallengeRecordsByStatus(challenges: ChallengeRecord[], userId: string, status: number): Promise<ChallengeRecord[]> {
    const resolvedStatus = await Promise.all(
      challenges.map(async (challenge) => {
        return (await this.getStatusForUserAndChallenge(userId, challenge.id)) === status;
      }),
    );
    return challenges.filter((item, i) => resolvedStatus[i]);
  }

  public async findOneBySlug(slug: string): Promise<Challenge> {
    const record = await this.prisma.challenge.findUnique({
      where: { slug },
    });

    return record ? ChallengeService.createModelFromDatabaseRecord(record) : null;
  }

  public async getNumberOfCodeLevelSubmissionsForUser(challengeId: string, userId: string): Promise<number> {
    return await this.prisma.codeLevelSubmission.count({
      where: {
        userId,
        level: {
          challengeId,
        },
      },
    });
  }

  public async getNumberOfQuizLevelSubmissionsForUser(challengeId: string, userId: string): Promise<number> {
    return await this.prisma.quizLevelSubmission.count({
      where: {
        userId,
        level: {
          challengeId,
        },
      },
    });
  }

  public async getNumberOfCodeLevelsForChallenge(challengeId: string): Promise<number> {
    return await this.prisma.codeLevel.count({
      where: {
        challengeId,
      },
    });
  }

  public async getNumberOfQuizLevelsForChallenge(challengeId: string): Promise<number> {
    return await this.prisma.quizLevel.count({
      where: {
        challengeId,
      },
    });
  }

  async getStatusForUserAndChallenge(userId: string, challengeId: string): Promise<ChallengeStatus> {
    const [codeSubmissionCount, quizSubmissionCount] = await Promise.all([
      this.getNumberOfCodeLevelSubmissionsForUser(challengeId, userId),
      this.getNumberOfQuizLevelSubmissionsForUser(challengeId, userId),
    ]);

    if (codeSubmissionCount === 0 && quizSubmissionCount === 0) {
      return ChallengeStatus.OPEN;
    }

    const [codeLevelCount, quizLevelCount] = await Promise.all([
      this.getNumberOfCodeLevelsForChallenge(challengeId),
      this.getNumberOfQuizLevelsForChallenge(challengeId),
    ]);

    const levelCount = codeLevelCount + quizLevelCount;

    const [successfulCodeLevelCount, successfulQuizLevelCount] = await Promise.all([
      this.getNumberOfFinishedCodeLevelsForUser(challengeId, userId),
      this.getNumberOfFinishedQuizLevelsForUser(challengeId, userId),
    ]);

    // if they are the same amount than the challenge levels the challenge is finished
    if (successfulCodeLevelCount + successfulQuizLevelCount === levelCount) {
      return ChallengeStatus.FINISHED;
    }

    return ChallengeStatus.IN_PROGRESS;
  }

  async getNumberOfFinishedLevelsForUserAndChallenge(userId: string, challengeId: string): Promise<number> {
    const [codeLevelCount, quizLevelCount] = await Promise.all([
      this.getNumberOfFinishedCodeLevelsForUser(challengeId, userId),
      this.getNumberOfFinishedQuizLevelsForUser(challengeId, userId),
    ]);

    return codeLevelCount + quizLevelCount;
  }

  public getNumberOfFinishedQuizLevelsForUser(challengeId: string, userId: string): Promise<number> {
    return this.prisma.quizLevel.count({
      where: {
        challengeId,
        submissions: {
          some: {
            AND: {
              userId,
              result: {
                status: ResultStatus.SUCCESS,
              },
            },
          },
        },
      },
    });
  }

  public getNumberOfFinishedCodeLevelsForUser(challengeId: string, userId: string): Promise<number> {
    // all levels from this challenge where at least one
    // submission has the users id and a successful result
    // means: all levels which have been finished by the user
    return this.prisma.codeLevel.count({
      where: {
        challengeId,
        submissions: {
          some: {
            AND: {
              userId,
              result: {
                status: ResultStatus.SUCCESS,
              },
            },
          },
        },
      },
    });
  }

  static createModelFromDatabaseRecord(record: ChallengeRecord): Challenge {
    const challenge = new Challenge({
      id: record.id,
      name: record.name,
      slug: record.slug,
      difficulty: record.difficulty,
      introduction: record.introduction,
    });

    return challenge;
  }
}
