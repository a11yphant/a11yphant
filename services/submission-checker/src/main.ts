import { INestMicroservice, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { AppModule } from "./app.module";

let app: INestMicroservice;

async function bootstrap(): Promise<INestMicroservice> {
  const logger = +process.env.SUBMISSION_CHECKER_DISABLE_LOGGER ? false : new Logger();
  // TODO: Remove when the following is fixed https://github.com/nestjs/nest/issues/2343
  const appContext = await NestFactory.createApplicationContext(AppModule, { logger });
  const config = appContext.get<ConfigService>(ConfigService);

  app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    logger,
    transport: Transport.RMQ,
    options: {
      urls: [config.get<string>("messaging.rabbitmq-url")],
      queue: config.get<string>("messaging.consume-queue-name"),
    },
  });

  await appContext.close();

  await app.listen();

  return app;
}
const appPromise = bootstrap();

export async function getApp(): Promise<INestMicroservice> {
  await appPromise;

  return app;
}
