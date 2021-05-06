import { Injectable } from "@nestjs/common";
import { Challenge as ChallengeRecord, Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { ChallengesFilter } from "./arg-types/challenges.args";
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
    const filterObject: Prisma.ChallengeFindManyArgs = { where: {} };

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
