import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private logger: Logger) {
    super();
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
