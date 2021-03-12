import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
// the serverless-express package does not work as expected
// when using it with a es-module import, hence the require
// eslint-disable-next-line
const serverlessExpress = require("@vendia/serverless-express");
import { APIGatewayProxyHandler } from "aws-lambda";
import * as express from "express";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<ReturnType<typeof serverlessExpress> | null> {
  /**
   * We need to manually instantiate an express instance, because we have to
   * forward lambda invocations to to the Nest router. To be able to
   * achieve that we need access to the express instance.
   */
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  const configService = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);

  const url = configService.get("api.url");
  const port = configService.get("api.port");

  if (!configService.get<boolean>("api.lambda")) {
    /**
     * If the application is not running in lambda mode, we boot up a regular Nest
     * application.
     */

    await app.listen(port);
    logger.log(`App listening on ${url}/graphql`, AppModule.name);
    return null;
  }

  /**
   * If the application is used in an lambda environment we do not need to listen to a
   * port for HTTP requests, since the requests will be passed programmatically to
   * the application using events by the lambda handler function.
   *
   * Instead listening to a port we need to initialize the application, so that it is
   * ready to accept requests.
   */
  await app.init();

  /**
   * The serverless express package allows to pass lambda events as HTTP requests to the
   * the express server. To do that we first have to extract a node HTTP server
   * from the express instance.
   *
   * We later need the node HTTP server for forwarding between the lambda events
   * and our server.
   */
  return serverlessExpress({ app: expressApp });
}

const server = bootstrap();

export const handle: APIGatewayProxyHandler = async (...args) => {
  /**
   * The serverless express handler converts the api gateway events in to HTTP requests
   * and forwards them to the HTTP server.
   *
   * On the first invocation of the lambda function (cold start), we have to wait until
   * the Nest application is started. Hence we have to wait until the promise for
   * the HTTP server resolves. For subsequent requests, there will not be
   * a delay since the server promise is already resolved.
   */
  return (await server).handler(...args);
};
