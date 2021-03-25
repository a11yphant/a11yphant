import { AwsTransportStrategy } from "@a11y-challenges/nestjs-aws-messaging";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";
import { SQSEvent } from "aws-lambda";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<AwsTransportStrategy> {
  // TODO: Remove when the following is fixed https://github.com/nestjs/nest/issues/2343
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get<ConfigService>(ConfigService);

  const server = new AwsTransportStrategy({
    polling: configService.get<boolean>("messaging.poll-queue"),
    queueUrl: configService.get<string>("messaging.queue-url"),
    region: configService.get<string>("messaging.region"),
  });

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    strategy: server,
  });

  await appContext.close();

  await app.listenAsync();

  return server;
}
const serverPromise = bootstrap();

export async function handle(event: SQSEvent): Promise<void> {
  const server = await serverPromise;

  await server.handleSQSEvent(event);
}
