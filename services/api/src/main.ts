import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { APIGatewayProxyHandler } from "aws-lambda";
import * as serverlessExpress from "aws-serverless-express";
import * as express from "express";
import { Server } from "http";

import { AppModule } from "./app.module";

let server: Server;
async function bootstrap(): Promise<void> {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  const configService = app.get(ConfigService);

  const url = configService.get("api.url");
  const port = configService.get("api.port");
  const inLambda = configService.get("api.lambda");

  if (!inLambda) {
    await app.listen(port);
    console.log(`App listening on ${url}/graphql`);
    return;
  }

  await app.init();

  server = serverlessExpress.createServer(expressApp);
}

const initializationPromise: Promise<void> = bootstrap();

export const handle: APIGatewayProxyHandler = async (event, context) => {
  await initializationPromise;

  return serverlessExpress.proxy(server, event, context, "PROMISE").promise;
};
