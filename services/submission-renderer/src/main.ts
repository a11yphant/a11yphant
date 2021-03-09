import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);
  const port = config.get<number>('submission-renderer.port');
  await app.listen(port);
  logger.log(`App listening on port ${port}`, AppModule.name);
}
bootstrap();
