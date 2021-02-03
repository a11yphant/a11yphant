import { Injectable } from '@nestjs/common';
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
    private prisma: PrismaService,
    private ymlReader: YamlReaderService,
  ) {}

  public async importAllFromFolder(folder: string): Promise<void> {
    const importPromises = (await readdir(folder))
      .filter((file) => file.endsWith('.yml'))
      .map(async (file) => {
        const filePath = join(folder, file);
        const content = await this.ymlReader.readChallenge(filePath);
        await this.importChallenge(content);
      });

    await Promise.all(importPromises);
  }

  public async importChallenge(challenge: Challenge): Promise<void> {
    await this.prisma.challenge.upsert({
      where: { id: challenge.id },
      create: challenge,
      update: challenge,
    });
  }
}
