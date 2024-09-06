/**
 * @jest-environment node
 */

import { DynamicModule } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { PRISMA_MODULE_CONFIG } from "@/prisma/constants";
import { PrismaModule } from "@/prisma/prisma.module";

describe("prisma module", () => {
  it("can instantiate the module", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PrismaModule.forRootAsync({
          useFactory: () => ({
            databaseUrl: process.env.DATABASE_URL,
          }),
        }),
        PrismaModule,
      ],
    }).compile();

    expect(moduleRef).toBeTruthy();
  });

  it("provides the database url with forRootAsync", async () => {
    const module = await PrismaModule.forRootAsync({
      imports: ["module" as unknown as DynamicModule],
      useFactory: (value) => ({ databaseUrl: value }),
      inject: ["service"],
    });
    const url = module.providers?.find((provider: any) => provider.provide === PRISMA_MODULE_CONFIG) as unknown as any;

    expect(module.imports).toContain("module");
    expect(url).toBeTruthy();
    expect(url.useFactory).toBeTruthy();
    expect(url.inject).toEqual(["service"]);
  });
});
