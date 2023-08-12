import { ConfigService } from "@nestjs/config";
import { Command, Console } from "nestjs-console";

import { ImportService } from "./import.service";

@Console()
export class ImportChallenges {
  constructor(
    private config: ConfigService,
    private importer: ImportService,
  ) {}

  @Command({
    command: "import:challenges",
    description: "Imports challenges from the filesystem into the database",
  })
  async importChallenges(): Promise<void> {
    if (!this.config.get<boolean>("api.importer-enabled")) {
      return;
    }

    await this.importer.importAllFromFolder(this.config.get<string>("api.challenges-location"));
  }
}
