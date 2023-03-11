import "module-alias/register";

import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

export function configureApp(app: INestApplication): void {
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
}

export async function setupMicroservices(app: INestApplication): Promise<void> {
  const config = app.get<ConfigService>(ConfigService);
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.get<string>("messaging.rabbitmq-url")],
      queue: config.get<string>("messaging.consume-queue-name"),
    },
  });
}

export async function bootstrap(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const configService = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);

  configureApp(app);
  await setupMicroservices(app);

  const url = configService.get("api.url");
  const port = configService.get("api.port");

  await app.listen(port);
  await app.startAllMicroservices();
  logger.log(`App listening on ${url}/graphql`, AppModule.name);

  return app;
}

if (require.main === module) {
  bootstrap();
}
