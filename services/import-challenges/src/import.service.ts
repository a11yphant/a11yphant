import { Injectable, Logger } from '@nestjs/common';
import { readdir as readdirCallback } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import {
  Challenge,
  Hint,
  Level,
  Requirement,
  Resource,
} from './challenge.interface';
import { PrismaService } from './prisma/prisma.service';
import { YamlReaderService } from './yaml-reader.service';

const readdir = promisify(readdirCallback);

@Injectable()
export class ImportService {
  constructor(
    private logger: Logger,
    private prisma: PrismaService,
    private ymlReader: YamlReaderService,
  ) {}

  public async importAllFromFolder(folder: string): Promise<void> {
    const path = join(__dirname, folder);
    this.logger.log(`Importing yml files from ${path}`, ImportService.name);

    const importPromises = (await readdir(path))
      .filter((file) => file.endsWith('.yml'))
      .map(async (file) => {
        this.logger.log(`Importing file: ${file}`, ImportService.name);

        const filePath = join(path, file);
        const content = await this.ymlReader.readChallenge(filePath);

        await this.importChallenge(content);
      });

    await Promise.all(importPromises);
    this.logger.log(
      `Imported ${importPromises.length} challenges`,
      ImportService.name,
    );
  }

  public async importChallenge(challenge: Challenge): Promise<void> {
    await this.upsertChallenge(challenge);

    await this.upsertLevelsForChallenge(challenge.levels, challenge.id);

    for (const level of challenge.levels) {
      await this.upsertRequirementsForLevel(level.requirements, level.id);
      await this.upsertResourcesForLevel(level.resources, level.id);
      await this.upsertHintsForLevel(level.hints, level.id);
    }
  }

  private async upsertChallenge(challenge: Challenge): Promise<void> {
    await this.prisma.challenge.upsert({
      where: { id: challenge.id },
      create: {
        id: challenge.id,
        name: challenge.name,
      },
      update: {
        name: challenge.name,
      },
    });
  }

  private async upsertLevelsForChallenge(
    levels: Level[],
    challengeId: string,
  ): Promise<void> {
    await Promise.all(
      levels.map(async (level) => {
        await this.prisma.level.upsert({
          where: { id: level.id },
          create: {
            id: level.id,
            tldr: level.tldr,
            instructions: level.instructions,
            challengeId,
          },
          update: {
            tldr: level.tldr,
            instructions: level.instructions,
            challengeId,
          },
        });
      }),
    );
  }

  private async upsertRequirementsForLevel(
    requirements: Requirement[],
    levelId: string,
  ): Promise<void> {
    await Promise.all(
      requirements.map(async (requirement) => {
        await this.prisma.requirement.upsert({
          where: { id: requirement.id },
          create: {
            id: requirement.id,
            title: requirement.title,
            levelId,
          },
          update: { title: requirement.title, levelId },
        });
      }),
    );
  }

  private async upsertResourcesForLevel(
    resources: Resource[],
    levelId: string,
  ): Promise<void> {
    await Promise.all(
      resources.map(async (resource) => {
        await this.prisma.resource.upsert({
          where: { id: resource.id },
          create: {
            id: resource.id,
            title: resource.title,
            link: resource.link,
            levelId,
          },
          update: {
            title: resource.title,
            link: resource.link,
            levelId,
          },
        });
      }),
    );
  }

  private async upsertHintsForLevel(
    hints: Hint[],
    levelId: string,
  ): Promise<void> {
    await Promise.all(
      hints.map(async (hint) => {
        await this.prisma.hint.upsert({
          where: { id: hint.id },
          create: {
            id: hint.id,
            content: hint.content,
            levelId,
          },
          update: { content: hint.content, levelId },
        });
      }),
    );
  }
}
