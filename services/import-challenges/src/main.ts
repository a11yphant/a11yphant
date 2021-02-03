import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ImportService } from './import.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.init();

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
bootstrap();
