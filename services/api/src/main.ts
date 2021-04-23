import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);

  const url = configService.get("api.url");
  const port = configService.get("api.port");

  await app.listen(port);
  logger.log(`App listening on ${url}/graphql`, AppModule.name);
}

bootstrap();
