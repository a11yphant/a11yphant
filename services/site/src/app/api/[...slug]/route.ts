import { NestFactory } from "@nestjs/core";
import serverlessExpress from "@codegenie/serverless-express";
import { AppModule } from "./app.module";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";

function getRequest({ event }): ExpressRequest {
  const headers = {};
  const request = event as Request;

  if (request.headers) {
    for (const [key, value] of request.headers.entries()) {
      headers[key] = value;
    }
  }

  return {
    method: request.method,
    path: request.url,
    headers,
    body: request.body,
  };
}

function getResponse(response): Response {
  return new Response(response.body, { status: response.statusCode, statusText: response.statusMessage, headers: response.headers });
}

type Handler = (request: Request) => Response;
let handler: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress<Request, Response>({ app: expressApp, eventSourceName: "custom", eventSource: { getRequest, getResponse } });
}

export async function GET(request: Request): Promise<Response> {
  handler = handler ?? (await bootstrap());
  return handler(request);
}
