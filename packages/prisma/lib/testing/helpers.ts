import { Logger } from "@nestjs/common";
import { execSync } from "child_process";
import os from "os";

import { PrismaClient } from "../client";
import { PrismaService } from "../prisma.service";

const dbUrl = new URL(process.env.DB_URL || "postgresql://please-provide-a-connection-url/db");
const presetDbUrl = getPresetDBUrl();

function getPresetDBUrl(): URL {
  const presetDbName = `${dbUrl.pathname.slice(1)}-testing-preset`;
  const presetDbUrl = new URL(dbUrl.toString());
  presetDbUrl.pathname = `/${presetDbName}`;
  return presetDbUrl;
}

export function getDatabaseName(workerId?: number): string {
  return `${dbUrl.pathname.slice(1)}-test-${workerId || process.env.JEST_WORKER_ID || 1}`;
}

async function createPresetDb(): Promise<void> {
  const client = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl.toString(),
      },
    },
  });

  await client.$connect();
  await client.$executeRaw(`DROP DATABASE IF EXISTS "${presetDbUrl.pathname.slice(1)}"`);
  await client.$executeRaw(`CREATE DATABASE "${presetDbUrl.pathname.slice(1)}"`);
  await client.$disconnect();
}

export async function setupDatabase(): Promise<void> {
  await createPresetDb();
  execSync(`DATABASE_URL=${presetDbUrl.toString()} npx prisma migrate dev --preview-feature`);

  const client = new PrismaClient({
    datasources: {
      db: {
        url: presetDbUrl.toString(),
      },
    },
  });

  for (let worker = 1; worker < os.cpus().length; worker++) {
    try {
      await client.$executeRaw(`DROP DATABASE IF EXISTS "${getDatabaseName(worker)}";`);
    } catch {
      console.log("Failed dropping existing test database");
      await client.$disconnect();
      return;
    }

    try {
      await client.$executeRaw(
        `CREATE DATABASE "${getDatabaseName(worker)}" TEMPLATE "${presetDbUrl.pathname.slice(1)}" OWNER "${presetDbUrl.username}";`,
      );
    } catch (error) {
      console.log("Failed duplicating the template database");
      console.log(error);
      await client.$disconnect();
      return;
    }
  }

  await client.$disconnect();
}

export function getCurrentDbUrl() {
  return presetDbUrl.toString().replace(presetDbUrl.pathname.slice(1), getDatabaseName());
}

export function createTestingPrismaClient(logger: Logger): PrismaService {
  return new PrismaService(logger, {
    databaseUrl: getCurrentDbUrl(),
  });
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
    try {
      const tableNames = await client.$queryRaw(`
          SELECT table_name FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name != '_Migration';
        `);

      for (const tableName of tableNames.map((row: any) => row.table_name)) {
        await client.$executeRaw(`DELETE FROM "${tableName}";`);

        if (!["Store"].includes(tableName)) {
          await client.$executeRaw(`ALTER SEQUENCE "${tableName}_id_seq" RESTART WITH 1;`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  });

  return {
    getPrismaService: () => client,
  };
}
