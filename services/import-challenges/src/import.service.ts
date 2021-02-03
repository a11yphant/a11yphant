import { Injectable, Logger } from '@nestjs/common';
import { readdir as readdirCallback } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { PrismaService } from './prisma/prisma.service';
import { RawChallenge } from './raw-challenge.interface';
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

  public async importChallenge(challenge: RawChallenge): Promise<void> {
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

    await Promise.all(
      challenge.levels.map(async (level) => {
        await this.prisma.level.upsert({
          where: { id: level.id },
          create: {
            id: level.id,
            tldr: level.tldr,
            instructions: level.instructions,
            challengeId: challenge.id,
          },
          update: {
            tldr: level.tldr,
            instructions: level.instructions,
            challengeId: challenge.id,
          },
        });
      }),
    );

    await Promise.all(
      challenge.levels
        .map((level) => {
          return {
            ...level,
            requirements: level.requirements.map((requirement) => ({
              ...requirement,
              levelId: level.id,
            })),
          };
        })
        .flatMap((level) => level.requirements)
        .map(async (requirement) => {
          await this.prisma.requirement.upsert({
            where: { id: requirement.id },
            create: {
              id: requirement.id,
              title: requirement.title,
              levelId: requirement.levelId,
            },
            update: { title: requirement.title, levelId: requirement.levelId },
          });
        }),
    );

    await Promise.all(
      challenge.levels
        .map((level) => {
          return {
            ...level,
            resources: level.resources.map((hint) => ({
              ...hint,
              levelId: level.id,
            })),
          };
        })
        .flatMap((level) => level.resources)
        .map(async (resource) => {
          await this.prisma.resource.upsert({
            where: { id: resource.id },
            create: {
              id: resource.id,
              title: resource.title,
              link: resource.link,
              levelId: resource.levelId,
            },
            update: {
              title: resource.title,
              link: resource.link,
              levelId: resource.levelId,
            },
          });
        }),
    );

    await Promise.all(
      challenge.levels
        .map((level) => {
          return {
            ...level,
            hints: level.hints.map((hint) => ({
              ...hint,
              levelId: level.id,
            })),
          };
        })
        .flatMap((level) => level.hints)
        .map(async (hint) => {
          await this.prisma.hint.upsert({
            where: { id: hint.id },
            create: {
              id: hint.id,
              content: hint.content,
              levelId: hint.levelId,
            },
            update: { content: hint.content, levelId: hint.levelId },
          });
        }),
    );
  }
}
