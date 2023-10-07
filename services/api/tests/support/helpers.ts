import { ApolloClient, ApolloLink, concat, HttpLink, InMemoryCache } from "@apollo/client/core";
import { faker } from "@faker-js/faker";
import { createMock, PartialFuncReturn } from "@golevelup/ts-jest";
import { CallHandler, ExecutionContext, INestApplication, Logger, NestInterceptor } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Observable, of } from "rxjs";

import { CodeLevelSubmission as Submission } from "@/submission/graphql/models/code-level-submission.model";
import { Rule } from "@/submission/interfaces/rule.interface";

import { getCurrentSchemaUrl } from "./database";

export { getCurrentSchemaUrl, useDatabase } from "./database";

export function createConfigServiceMock(data?: Record<string, any>): PartialFuncReturn<ConfigService<Record<string, unknown>>> {
  const mockData = {
    "cookie.name": "a11yphant_session",
    "cookie.defaultConfig": { sameSite: "lax", secure: true, httpOnly: true },
    ...data,
  };
  return {
    get: jest.fn((key: string) => {
      return mockData[key];
    }),
  };
}

interface GetGraphQlClientOptions {
  authCookie?: string;
}

export function useTestingApp(): { getGraphQlClient: (options?: GetGraphQlClientOptions) => ApolloClient<unknown>; getApp: () => INestApplication } {
  process.env.API_KEY = "secret";
  process.env.IGNORE_ENV_FILE = "true";
  process.env.DB_URL = getCurrentSchemaUrl();

  let app: INestApplication;

  beforeEach(async () => {
    const { configureApp } = await import("../../src/main");
    const { appModuleMetadata } = await import("../../src/app.module");

    const module = await Test.createTestingModule(appModuleMetadata).compile();

    module.useLogger(createMock<Logger>());

    app = module.createNestApplication();
    configureApp(app);
    await app.listen(0);
  });

  afterEach(async () => {
    await app.close();
  });

  const getGraphQlClient = ({ authCookie } = { authCookie: undefined }): ApolloClient<unknown> => {
    const httpLink = new HttpLink({
      uri: `http://localhost:${app.getHttpServer().address().port}/graphql`,
      fetch,
      credentials: "include",
    });

    const headerMiddleware = new ApolloLink((operation, forward) => {
      if (authCookie) {
        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            cookie: `a11yphant_session=${authCookie}`,
          },
        }));
      }

      return forward(operation);
    });

    return new ApolloClient({
      link: concat(headerMiddleware, httpLink),
      cache: new InMemoryCache(),
    });
  };

  return {
    getGraphQlClient,
    getApp: () => app,
  };
}

export function runInterceptor(
  interceptor: NestInterceptor,
  executionContext: ExecutionContext,
  nextCallback: () => void,
  completeCallback: () => void,
  done: () => {},
): void {
  const handle = jest.fn(() => of("something"));
  (interceptor.intercept(executionContext, createMock<CallHandler>({ handle })) as Promise<Observable<any>>).then((observable) =>
    observable.subscribe({
      next() {
        nextCallback();
      },
      complete() {
        completeCallback();
        done();
      },
    }),
  );
}

export function createRule(rule: Partial<Rule> = {}): Rule {
  const defaultValues: Rule = {
    id: faker.string.uuid(),
    key: "rule-key",
    options: {},
  };

  return {
    ...defaultValues,
    ...rule,
  };
}

export function createSubmission(submission: Partial<Submission> = {}): Submission {
  const defaultValues: Submission = {
    id: faker.string.uuid(),
    html: "html",
    css: "css",
    js: "js",
    levelId: "someId",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    ...defaultValues,
    ...submission,
  };
}
