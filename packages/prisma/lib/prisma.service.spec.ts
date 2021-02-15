import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { PrismaService } from "./prisma.service";
import { getCurrentDbUrl } from "./testing/helpers";

describe("prisma service", () => {
  it("can connect and disconnect to the database", () => {
    const service = new PrismaService(createMock<Logger>(), {
      databaseUrl: getCurrentDbUrl(),
    });

    expect(() => service.onModuleInit()).not.toThrowError();
    expect(() => service.onModuleDestroy()).not.toThrowError();
  });
});
