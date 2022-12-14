import { createMock, PartialFuncReturn } from "@golevelup/ts-jest";
import { CallHandler, ExecutionContext, INestApplication, Logger, NestInterceptor } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { Migrate } from "@prisma/migrate";
import ApolloClient from "apollo-boost";
import fetch from "cross-fetch";
import os from "os";
import { join } from "path";
import { Observable, of } from "rxjs";

import { PrismaService } from "../../src/prisma/prisma.service";

function getDbUrl(): URL {
  return new URL(process.env.DB_URL || "postgresql://please-provide-a-connection-url/db");
}

export function getSchemaName(workerId?: number): string {
  return `a11yphant-test-${workerId || process.env.JEST_WORKER_ID || 1}`;
}

export async function setupDatabase(): Promise<void> {
  const originalDBUrl = getDbUrl().toString();
  const schemaPath = join(__dirname, "../../prisma/schema.prisma");

  const client = new PrismaClient({
    datasources: {
      db: {
        url: getDbUrl().toString(),
      },
    },
  });

  try {
    await client.$connect();
  } catch (e) {
    throw new Error(`Could not connect to the database: ${e.message}`);
  }

  for (let worker = 1; worker < os.cpus().length; worker++) {
    try {
      await client.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${getSchemaName(worker)}"`);
    } catch (e) {
      throw new Error(`Could not create a schema for worker ${worker}: ${e.message}`);
    }

    try {
      process.env.DB_URL = getCurrentSchemaUrl(worker);
      const migrate = new Migrate(schemaPath);
      await migrate.applyMigrations();
      process.env.DB_URL = originalDBUrl;
      migrate.stop();
    } catch (error) {
      throw new Error(`Failed migrating the test schema ${getSchemaName(worker)}: ${error.message}`);
    }
  }

  await client.$disconnect();
}

export function getCurrentSchemaUrl(workerId?: number): string {
  const url = new URL(getDbUrl().toString());
  url.searchParams.set("schema", getSchemaName(workerId));
  return url.toString();
}

export function createTestingPrismaClient(logger: Logger): PrismaService {
  return new PrismaService(logger, {
    databaseUrl: getCurrentSchemaUrl(),
  });
}

async function clearTableContents(client: PrismaClient): Promise<void> {
  const tableNames = await client.$queryRawUnsafe<{ table_name: string }[]>(`
          SELECT table_name FROM information_schema.tables
          WHERE table_schema = '${getSchemaName()}' AND table_name != '_prisma_migrations';
        `);

  for (const tableName of tableNames.map((row: any) => row.table_name)) {
    await client.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" CASCADE;`);
  }
}

export function useDatabase(logger?: Logger): { getPrismaService: () => PrismaService } {
  const client = createTestingPrismaClient(logger || createMock<Logger>());
  beforeAll(async () => {
    await client.$connect();
  });

  afterAll(async () => {
    await client.$disconnect();
  });

  afterEach(async () => {
    await clearTableContents(client);
  });

  return {
    getPrismaService: () => client,
  };
}

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
  process.env.API_MESSAGING_POLL_QUEUE = "false";

  let app: INestApplication;

  beforeEach(async () => {
    const { configureApp, setupMicroservices } = await import("../../src/main");
    const { appModuleMetadata } = await import("../../src/app.module");

    const module = await Test.createTestingModule(appModuleMetadata).compile();

    module.useLogger(createMock<Logger>());

    app = module.createNestApplication();
    configureApp(app);
    setupMicroservices(app);
    await app.listen(0);
  });

  afterEach(async () => {
    await app.close();
  });

  return {
    getGraphQlClient: ({ authCookie } = {}) =>
      new ApolloClient({
        uri: `http://localhost:${app.getHttpServer().address().port}/graphql`,
        credentials: "include",
        fetch,
        request: (operation) => {
          if (!authCookie) return;
          operation.setContext({
            headers: {
              cookie: `a11yphant_session=${authCookie}`,
            },
          });
        },
      }),
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
