import { Challenge as ChallengeRecord, PrismaService } from "@a11yphant/prisma";
import { Injectable } from "@nestjs/common";

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

  public async findAll(): Promise<Challenge[]> {
    const challenges = await this.prisma.challenge.findMany();
    return challenges.map((challenge) => ChallengeService.createModelFromDatabaseRecord(challenge));
  }

  public async findOneBySlug(slug: string): Promise<Challenge> {
    const record = await this.prisma.challenge.findUnique({
      where: { slug },
    });

    return record ? ChallengeService.createModelFromDatabaseRecord(record) : null;
  }

  static createModelFromDatabaseRecord(record: ChallengeRecord): Challenge {
    const challenge = new Challenge({ id: record.id, name: record.name, slug: record.slug });

    return challenge;
  }
}
