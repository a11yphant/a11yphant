import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import serverlessExpress from "@vendia/serverless-express";
import { APIGatewayProxyHandlerV2, Handler } from "aws-lambda";
import express from "express";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<Handler> {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const config = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);
  const port = config.get<number>("submission-renderer.port");

  if (!config.get<boolean>("submission-renderer.lambda")) {
    await app.listen(port);
    logger.log(`App listening on port ${port}`, AppModule.name);
    return;
  }

  await app.init();
  logger.log("App initialized");

  const handler = serverlessExpress({ app: server });

  return handler;
}
const handlerPromise = bootstrap();

export const handler: APIGatewayProxyHandlerV2 = async (...args) => {
  const handler = await handlerPromise;
  return handler(...args);
};
