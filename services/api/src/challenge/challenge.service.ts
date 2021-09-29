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

  public async findAll(filter?: ChallengesFilter): Promise<Challenge[]> {
    const filterObject: Prisma.ChallengeFindManyArgs = { where: {}, orderBy: { order: "asc" } };

    if (filter) {
      filterObject.where = { ...filter };
    }

    const challenges = await this.prisma.challenge.findMany(filterObject);
    return challenges.map((challenge) => ChallengeService.createModelFromDatabaseRecord(challenge));
  }

  public async findOneBySlug(slug: string): Promise<Challenge> {
    const record = await this.prisma.challenge.findUnique({
      where: { slug },
    });

    return record ? ChallengeService.createModelFromDatabaseRecord(record) : null;
  }

  async getStatusForUserAndChallenge(userId: string, challengeId: string): Promise<ChallengeStatus> {
    const submissionCount = await this.prisma.submission.count({
      where: {
        userId,
        level: {
          challengeId,
        },
      },
    });

    if (submissionCount === 0) return ChallengeStatus.OPEN;

    const levelCount = await this.prisma.level.count({
      where: {
        challengeId,
      },
    });

    // all levels from this challenge where at least one
    // submission has the users id and a successful result
    // means: all levels which have been finished by the user
    const successfulLevelCount = await this.prisma.level.count({
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

    // if they are the same amount than the challenge levels the challenge is finished
    if (successfulLevelCount === levelCount) return ChallengeStatus.FINISHED;

    return ChallengeStatus.IN_PROGRESS;
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
