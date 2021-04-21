import { AwsTransportStrategy } from "@a11yphant/nestjs-aws-messaging";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";
import { ExpressAdapter, NestExpressApplication } from "@nestjs/platform-express";
import serverlessExpress from "@vendia/serverless-express";
import { APIGatewayProxyEventV2, Callback, Context, SQSEvent } from "aws-lambda";
import express from "express";

import { AppModule } from "./app.module";

let transportStrategy: AwsTransportStrategy;

async function bootstrap(): Promise<NestExpressApplication | void> {
  const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(expressApp));
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);

  transportStrategy = new AwsTransportStrategy({
    polling: configService.get<boolean>("messaging.poll-queue"),
    queueUrl: configService.get<string>("messaging.queue-url"),
    region: configService.get<string>("messaging.region"),
    deleteHandled: configService.get<boolean>("messaging.delete-handled-messages"),
  });

  await app.connectMicroservice<MicroserviceOptions>({
    strategy: transportStrategy,
  });

  const url = configService.get("api.url");
  const port = configService.get("api.port");

  await app.startAllMicroservicesAsync();

  if (!configService.get<boolean>("api.lambda")) {
    await app.listen(port);
    logger.log(`App listening on ${url}/graphql`, AppModule.name);
    return;
  }

  await app.init();
  return app;
}

const appPromise = bootstrap();

export async function handle(event: SQSEvent | APIGatewayProxyEventV2, context: Context, callback: Callback): Promise<any> {
  const app = (await appPromise) as NestExpressApplication;

  if ((event as APIGatewayProxyEventV2).rawPath) {
    const handler = serverlessExpress({ app: app.getHttpAdapter().getInstance() });
    return handler(event, context, callback);
  }

  if ((event as SQSEvent).Records) {
    await transportStrategy.handleSQSEvent(event as SQSEvent);
  }
}
