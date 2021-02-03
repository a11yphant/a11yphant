import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import databaseConfig from './config/database.config';
import importChallengesConfig from './config/import-challenges.config';
import { ImportService } from './import.service';
import { PrismaModule } from './prisma/prisma.module';
import { YamlReaderService } from './yaml-reader.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [importChallengesConfig, databaseConfig],
    }),
    PrismaModule,
  ],
  providers: [YamlReaderService, ImportService, Logger],
})
export class AppModule {}
