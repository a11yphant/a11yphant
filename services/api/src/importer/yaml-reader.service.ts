import { Injectable } from "@nestjs/common";
import { readFile as readFileCallback } from "fs";
import { load } from "js-yaml";
import { promisify } from "util";

const readFile = promisify(readFileCallback);

@Injectable()
export class YamlReaderService {
  public async readFile<T>(path: string, key: string): Promise<T> {
    const yml = await readFile(path);
    return load(yml.toString())[key] as T;
  }
}
