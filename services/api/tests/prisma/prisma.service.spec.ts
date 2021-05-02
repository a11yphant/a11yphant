import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";

import { PrismaService } from "../../src/prisma/prisma.service";
import { getCurrentSchemaUrl } from "../helpers";

describe("prisma service", () => {
  it("can connect and disconnect to the database", () => {
    const service = new PrismaService(createMock<Logger>(), {
      databaseUrl: getCurrentSchemaUrl(),
    });

    expect(() => service.onModuleInit()).not.toThrowError();
    expect(() => service.onModuleDestroy()).not.toThrowError();
  });
});
