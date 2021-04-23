import { Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Migrate } from "@prisma/migrate";
import os from "os";
import { join } from "path";

import { PrismaService } from "../src/prisma/prisma.service";

function getDbUrl(): URL {
  return new URL(process.env.DB_URL || "postgresql://please-provide-a-connection-url/db");
}

export function getSchemaName(workerId?: number): string {
  return `a11yphant-test-${workerId || process.env.JEST_WORKER_ID || 1}`;
}

export async function setupDatabase(): Promise<void> {
  const originalDBUrl = getDbUrl().toString();
  const schemaPath = join(__dirname, "../prisma/schema.prisma");

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
      await client.$executeRaw(`CREATE SCHEMA IF NOT EXISTS "${getSchemaName(worker)}"`);
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
  const tableNames = await client.$queryRaw(`
          SELECT table_name FROM information_schema.tables
          WHERE table_schema = '${getSchemaName()}' AND table_name != '_prisma_migrations';
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
