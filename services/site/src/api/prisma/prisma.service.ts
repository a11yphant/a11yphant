import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { PRISMA_MODULE_CONFIG } from "./constants";
import { PrismaModuleConfig } from "./prisma-module-config.interface";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(
    private logger: Logger,
    @Inject(PRISMA_MODULE_CONFIG) config: PrismaModuleConfig,
  ) {
    super({
      datasources: {
        db: {
          url: config.databaseUrl,
        },
      },
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log("Database connection established", PrismaService.name);
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log("Database disconnected", PrismaService.name);
  }
}
