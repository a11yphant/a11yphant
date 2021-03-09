import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { S3Handler } from 'aws-lambda';

import { AppModule } from './app.module';
import { ImportService } from './import.service';
import { S3DownloadService } from './s3-download.service';

async function bootstrap(): Promise<INestApplicationContext | void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.init();

  const config = app.get<ConfigService>(ConfigService);
  if (config.get<boolean>('import-challenges.is-lambda')) {
    return app;
  }

  const logger = app.get<Logger>(Logger);

  try {
    await importChallenges(app);
  } catch (error) {
    logger.error(`Challenge import failed: ${error.message}`, AppModule.name);
  }
}

async function importChallenges(app: INestApplicationContext): Promise<void> {
  const config = app.get<ConfigService>(ConfigService);
  const importer = app.get<ImportService>(ImportService);
  const logger = app.get<Logger>(Logger);

  logger.log('Starting challenge import', AppModule.name);

  await importer.importAllFromFolder(
    config.get<string>('import-challenges.challenges-location'),
  );

  logger.log('Successfully imported challenges', AppModule.name);
}

const appPromise = bootstrap();

export const handle: S3Handler = async (event) => {
  const app = await (appPromise as Promise<INestApplicationContext>);
  const config = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' '),
  );

  logger.log(
    `Loading challenges from S3 (Bucket: ${bucket}, Key: ${key})`,
    AppModule.name,
  );
  const downloader = await app.get<S3DownloadService>(S3DownloadService);
  await downloader.downloadAndUnzip(
    bucket,
    key,
    config.get<string>('import-challenges.challenges-location'),
  );

  try {
    await importChallenges(app);
  } catch (error) {
    logger.error(`Challenge import failed: ${error.message}`, AppModule.name);
  }
};
