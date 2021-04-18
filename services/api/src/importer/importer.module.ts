import { Module } from "@nestjs/common";

import { ImportChallenges } from "./import-challenges.console";

@Module({
  providers: [ImportChallenges],
})
export class ImporterModule {}
