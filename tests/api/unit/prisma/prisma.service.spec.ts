/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { getCurrentSchemaUrl } from "@tests/support/helpers";

import { PrismaService } from "@/prisma/prisma.service";

let dbUrl: string = null;

describe("prisma service", () => {
  beforeAll(() => {
    dbUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = getCurrentSchemaUrl();
  });

  it("can connect and disconnect to the database", () => {
    const service = new PrismaService(createMock<Logger>());

    expect(() => service.onModuleInit()).not.toThrowError();
    expect(() => service.onModuleDestroy()).not.toThrowError();
  });

  afterAll(() => {
    process.env.DATABASE_URL = dbUrl;
  });
});
