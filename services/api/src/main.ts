import { AwsTransportStrategy } from "@a11yphant/nestjs-aws-messaging";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";
import { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "./app.module";

let transportStrategy: AwsTransportStrategy;

async function bootstrap(): Promise<NestExpressApplication | void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);

  transportStrategy = new AwsTransportStrategy({
    polling: configService.get<boolean>("messaging.poll-queue"),
    queueUrl: configService.get<string>("messaging.queue-url"),
    region: configService.get<string>("messaging.region"),
    deleteHandled: true,
  });

  await app.connectMicroservice<MicroserviceOptions>({
    strategy: transportStrategy,
  });

  const url = configService.get("api.url");
  const port = configService.get("api.port");

  await app.listen(port);
  await app.startAllMicroservicesAsync();
  logger.log(`App listening on ${url}/graphql`, AppModule.name);
}

bootstrap();
