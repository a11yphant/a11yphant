import { Injectable } from '@nestjs/common';
import { readFile as readFileCallback } from 'fs';
import { load } from 'js-yaml';
import { promisify } from 'util';

import { RawChallenge } from './raw-challenge.interface';

const readFile = promisify(readFileCallback);

@Injectable()
export class YamlReaderService {
  public async readChallenge(path: string): Promise<RawChallenge> {
    const yml = await readFile(path);
    const { challenge } = load(yml.toString()) as { challenge: RawChallenge };

    return challenge;
  }
}
