import { AwsTransportStrategy } from "@a11yphant/nestjs-aws-messaging";
import { INestMicroservice, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";
import { SQSEvent } from "aws-lambda";

import { AppModule } from "./app.module";

let app: INestMicroservice;

async function bootstrap(): Promise<AwsTransportStrategy> {
  const logger = +process.env.SUBMISSION_CHECKER_DISABLE_LOGGER ? false : new Logger();

  // TODO: Remove when the following is fixed https://github.com/nestjs/nest/issues/2343
  const appContext = await NestFactory.createApplicationContext(AppModule, { logger });
  const configService = appContext.get<ConfigService>(ConfigService);

  const server = new AwsTransportStrategy({
    polling: configService.get<boolean>("messaging.poll-queue"),
    queueUrl: configService.get<string>("messaging.queue-url"),
    region: configService.get<string>("messaging.region"),
    deleteHandled: configService.get<boolean>("messaging.delete-handled-messages"),
  });

  app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    strategy: server,
    logger,
  });

  await appContext.close();

  await app.listen();

  return server;
}
const serverPromise = bootstrap();

export async function getApp(): Promise<INestMicroservice> {
  await serverPromise;

  return app;
}

export async function handle(event: SQSEvent): Promise<void> {
  const server = await serverPromise;

  await server.handleSQSEvent(event);
}
