import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.init();
}
bootstrap();
