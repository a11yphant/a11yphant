import { DynamicModule, FactoryProvider, Logger, Module, ModuleMetadata } from "@nestjs/common";

import { PRISMA_MODULE_CONFIG } from "./constants";
import { PrismaService } from "./prisma.service";

const defaultProviders = [PrismaService, Logger];
const defaultExports = [PrismaService];

const defaultPrismaConfig: PrismaModuleConfig = {
  databaseUrl: "postgresql://please:provide@a:5432/database-url",
};

@Module({
  providers: [...defaultProviders, { provide: PRISMA_MODULE_CONFIG, useValue: defaultPrismaConfig }],
  exports: defaultExports,
})
export class PrismaModule {
  static forRoot(config: PrismaModuleConfig): DynamicModule {
    return {
      module: PrismaModule,
      providers: [...defaultProviders, { provide: PRISMA_MODULE_CONFIG, useValue: config.databaseUrl }],
      exports: defaultExports,
    };
  }

  static async forRootAsync(config: PrismaAsyncModuleConfig): Promise<DynamicModule> {
    return {
      module: PrismaModule,
      imports: [...(config.imports || [])],
      providers: [
        ...defaultProviders,
        {
          provide: PRISMA_MODULE_CONFIG,
          useFactory: async (...args) => {
            return await config.useFactory(...args);
          },
          inject: config.inject || [],
        },
      ],
      exports: defaultExports,
    };
  }
}

export interface PrismaModuleConfig {
  databaseUrl: string;
}

export interface PrismaAsyncModuleConfig extends Pick<ModuleMetadata, "imports"> {
  useFactory: (...args: any[]) => PrismaModuleConfig | Promise<PrismaModuleConfig>;
  inject?: FactoryProvider["inject"];
}
