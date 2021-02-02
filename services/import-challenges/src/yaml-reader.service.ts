import { Injectable } from '@nestjs/common';
import { Challenge } from '@prisma/client';
import { readFile as readFileCallback } from 'fs';
import { load } from 'js-yaml';
import { promisify } from 'util';

const readFile = promisify(readFileCallback);

@Injectable()
export class YamlReaderService {
  public async readChallenge(path: string): Promise<any> {
    const yml = await readFile(path);
    const { challenge } = load(yml.toString()) as { challenge: Challenge };

    return challenge;
  }
}
