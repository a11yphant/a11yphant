import { Global, Logger, Module } from "@nestjs/common";

import { PrismaService } from "./prisma.service";

const defaultProviders = [Logger];

const prismaFactory = {
  provide: PrismaService,
  useFactory: (logger: Logger) => {
    if (process.env.NODE_ENV === "development") {
      if (!global.prisma) {
        global.prisma = new PrismaService(logger);
      }

      logger.log("Using a cached prisma service instance to avoid creating to many database connections", PrismaModule.name);
      return global.prisma;
    }
    return new PrismaService(logger);
  },
  inject: [Logger],
};

@Global()
@Module({
  providers: [...defaultProviders, prismaFactory],
  exports: [prismaFactory],
})
export class PrismaModule {}
