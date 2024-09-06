import "reflect-metadata";

import serverlessExpress from "@codegenie/serverless-express";
import { Request as ExpressRequest } from "express";

import { bootstrap as initializeApp } from "../../../api/main";

type ParsedRequest = { request: Request; body?: Uint8Array };

function getRequest({ event }: { event: ParsedRequest }): ExpressRequest {
  const headers = {};
  const { request, body } = event;

  if (request.headers) {
    for (const [key, value] of request.headers.entries()) {
      headers[key] = value;
    }
  }

  return {
    method: request.method,
    path: request.url,
    url: request.url,
    headers,
    body,
  } as any;
}

function getResponse(response): Response {
  return new Response(response.body, { status: response.statusCode, statusText: response.statusMessage, headers: response.headers });
}

type Handler = (request: ParsedRequest) => Response;
let handler: Promise<Handler>;

async function bootstrap(): Promise<Handler> {
  const app = await initializeApp();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress<Request, Response>({ app: expressApp, eventSourceName: "custom", eventSource: { getRequest, getResponse } });
}

async function getContent(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const reader = stream.getReader();
  let content = new Uint8Array();

  const processText = ({ done, value }: { done: boolean; value: Uint8Array }): any => {
    if (done) {
      return undefined;
    }

    content = new Uint8Array([...content, ...value]);
    return reader.read().then(processText);
  };

  await reader.read().then(processText);
  reader.releaseLock();

  return content;
}

function getHandler(): Promise<Handler> {
  if (process.env.NODE_ENV === "production") {
    if (!handler) {
      handler = bootstrap();
    }
  } else {
    if (!global.handler) {
      global.handler = bootstrap();
    }

    handler = global.handler;
  }

  return handler;
}

export async function GET(request: Request): Promise<Response> {
  const resolvedHandler = await getHandler();
  return resolvedHandler({ request });
}

export async function POST(request: Request): Promise<Response> {
  const resolvedHandler = await getHandler();

  if (!request.body) {
    return resolvedHandler({ request });
  }

  return resolvedHandler({ request, body: await getContent(request.body) });
}
