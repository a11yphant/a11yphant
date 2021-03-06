import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { S3Handler } from 'aws-lambda';

import { AppModule } from './app.module';
import { ImportService } from './import.service';

async function bootstrap(): Promise<INestApplicationContext | void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.init();

  const config = app.get<ConfigService>(ConfigService);
  if (config.get<boolean>('import-challenges.is-lambda')) {
    return app;
  }

  await importChallenges(app);
}

async function importChallenges(app: INestApplicationContext): Promise<void> {
  const config = app.get<ConfigService>(ConfigService);
  const importer = app.get<ImportService>(ImportService);
  const logger = new Logger(AppModule.name);

  logger.log('Starting challenge import');
  try {
    await importer.importAllFromFolder(
      config.get<string>('import-challenges.challenges-location'),
    );
    logger.log('Successfully imported challenges');
  } catch (error) {
    logger.error(`Challenge import failed: ${error.message}`);
  } finally {
    logger.log('Stopping Nest application...');
    await app.close();
  }
}

const appPromise = bootstrap();

export const handle: S3Handler = async (event) => {
  const app = await (appPromise as Promise<INestApplicationContext>);
  const logger = new Logger(AppModule.name);

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' '),
  );

  logger.log(`Loading migrations from S3 (Bucket: ${bucket}, Key: ${key})`);

  await app.close();
};
