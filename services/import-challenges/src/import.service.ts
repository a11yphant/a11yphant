import { Injectable, Logger } from '@nestjs/common';
import { Challenge } from '@prisma/client';
import { readdir as readdirCallback } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

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
    await this.prisma.challenge.upsert({
      where: { id: challenge.id },
      create: challenge,
      update: challenge,
    });
  }
}
