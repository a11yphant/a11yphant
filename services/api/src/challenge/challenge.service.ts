import { PrismaService } from "@a11y-challenges/prisma";
import { Injectable } from "@nestjs/common";

import { Challenge } from "./models/challenge.model";

@Injectable()
export class ChallengeService {
  constructor(private prisma: PrismaService) {}

  public async findOne(id: string): Promise<Challenge> {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
    });

    return Challenge.fromDatabaseRecord(challenge);
  }
}
