import "module-alias/register";

import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
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

  const configService = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);

  configureApp(app);

  const url = configService.get("api.url");
  const port = configService.get("api.port");

  await app.listen(port);
  logger.log(`App listening on ${url}/graphql`, AppModule.name);

  return app;
}

if (require.main === module) {
  bootstrap();
}
