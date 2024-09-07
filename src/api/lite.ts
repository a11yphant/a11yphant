import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModuleLite } from "./app.lite.module";

export async function bootstrap(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModuleLite);
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  app.enableShutdownHooks();
  return app;
}
