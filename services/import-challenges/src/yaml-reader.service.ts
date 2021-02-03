import { Injectable } from '@nestjs/common';
import { readFile as readFileCallback } from 'fs';
import { load } from 'js-yaml';
import { promisify } from 'util';

import { Challenge } from './challenge.interface';

const readFile = promisify(readFileCallback);

@Injectable()
export class YamlReaderService {
  public async readChallenge(path: string): Promise<Challenge> {
    const yml = await readFile(path);
    const { challenge } = load(yml.toString()) as { challenge: Challenge };

    return challenge;
  }
}
