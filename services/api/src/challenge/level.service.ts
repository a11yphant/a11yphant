import { Level as LevelRecord, PrismaService } from "@a11y-challenges/prisma";
import { Injectable } from "@nestjs/common";

import { Code } from "./models/code.model";
import { Level } from "./models/level.model";

@Injectable()
export class LevelService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<Level> {
    const level = await this.prisma.level.findUnique({
      where: { id },
    });

    return level ? LevelService.createModelFromDatabaseRecord(level) : null;
  }

  async findForChallenge(challengeId: string): Promise<Level[]> {
    const levels = await this.prisma.level.findMany({
      where: {
        challengeId,
      },
    });
    return levels.map((level) => LevelService.createModelFromDatabaseRecord(level));
  }

  public static createModelFromDatabaseRecord(record: LevelRecord): Level {
    const level = new Level();
    level.id = record.id;
    level.tldr = record.tldr;
    level.instructions = record.instructions;

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
