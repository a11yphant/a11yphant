import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

export function configureApp(app: INestApplication): void {
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
}

export async function bootstrap(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  configureApp(app);
  await app.init();
  return app;
}

if (require.main === module) {
  bootstrap();
}
