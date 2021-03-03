import { PrismaService } from "@a11y-challenges/prisma";
import { Injectable } from "@nestjs/common";

import { Level } from "./models/level.model";

@Injectable()
export class LevelService {
  constructor(private prisma: PrismaService) {}
  async findForChallenge(challengeId: string): Promise<Level[]> {
    const levels = await this.prisma.level.findMany({
      where: {
        challengeId,
      },
    });
    return levels.map((level) => Level.fromDatabaseRecord(level));
  }
}
