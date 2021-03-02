import { Logger } from "@nestjs/common";
import { Migrate } from "@prisma/migrate";
import os from "os";
import { join } from "path";

import { PrismaClient } from "../../client";
import { PrismaService } from "../prisma.service";

function getDbUrl(): URL {
  return new URL(process.env.DB_URL || "postgresql://please-provide-a-connection-url/db");
}

export function getDatabaseName(workerId?: number): string {
  return `a11y-challenges-test-${workerId || process.env.JEST_WORKER_ID || 1}`;
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

  for (let worker = 1; worker < os.cpus().length - 1; worker++) {
    try {
      await client.$executeRaw(`CREATE DATABASE "${getDatabaseName(worker)}" OWNER "${getDbUrl().username}"`);
    } catch {
      // ignore errors since the database could already exist and postgres does not have a CREATE IF NOT EXISTS
    }

    try {
      process.env.DB_URL = getCurrentDbUrl(worker);
      const migrate = new Migrate(schemaPath);
      await migrate.applyMigrations();
      process.env.DB_URL = originalDBUrl;
      migrate.stop();
    } catch (error) {
      throw new Error(`Failed migrating the test database ${getDatabaseName(worker)}: ${error.message}`);
    }
  }

  await client.$disconnect();
}

export function getCurrentDbUrl(workerId?: number): string {
  const url = new URL(getDbUrl().toString());
  url.pathname = getDatabaseName(workerId);
  return url.toString();
}

export function createTestingPrismaClient(logger: Logger): PrismaService {
  return new PrismaService(logger, {
    databaseUrl: getCurrentDbUrl(),
  });
}

async function clearTableContents(client: PrismaClient): Promise<void> {
  const tableNames = await client.$queryRaw(`
          SELECT table_name FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name != '_prisma_migrations';
        `);

  for (const tableName of tableNames.map((row: any) => row.table_name)) {
    await client.$executeRaw(`DELETE FROM "${tableName}";`);
  }
}

export function useDatabase(logger: Logger): { getPrismaService: () => PrismaService } {
  const client = createTestingPrismaClient(logger);
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
