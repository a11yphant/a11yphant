import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<INestApplicationContext> {
  const app = await NestFactory.createApplicationContext(AppModule);

  await app.init();

  return app;
}
const app = bootstrap();

export async function handle(): Promise<void> {
  await app;
}
