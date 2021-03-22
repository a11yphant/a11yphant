import { Level as LevelRecord, PrismaService } from "@a11y-challenges/prisma";
import { Injectable } from "@nestjs/common";

import { Code } from "./models/code.model";
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
    return levels.map((level) => LevelService.createModelFromDatabaseRecord(level));
  }

  async findOneForChallengeAtIndex(challengeSlug: string, index: number): Promise<Level> {
    const record = await this.prisma.level.findFirst({
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

    return record ? LevelService.createModelFromDatabaseRecord(record) : null;
  }

  public static createModelFromDatabaseRecord(record: LevelRecord): Level {
    const level = new Level({ id: record.id, tldr: record.tldr, instructions: record.instructions });

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
