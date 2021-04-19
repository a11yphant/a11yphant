import { PrismaModule } from '@a11yphant/prisma';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import databaseConfig from './config/database.config';
import importChallengesConfig from './config/import-challenges.config';
import { S3DownloadService } from './s3-download.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [importChallengesConfig, databaseConfig],
    }),
    PrismaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        databaseUrl: config.get<string>('database.url'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [Logger, S3DownloadService],
})
export class AppModule {}
