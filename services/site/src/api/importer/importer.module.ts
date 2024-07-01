import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ImportService } from "./import.service";
import { ImportChallenges } from "./import-challenges.console";
import { YamlReaderService } from "./yaml-reader.service";

@Module({
  imports: [ConfigModule],
  providers: [ImportChallenges, ImportService, YamlReaderService, Logger],
})
export class ImporterModule {}
