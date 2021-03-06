import { DynamicModule, FactoryProvider, Logger, Module, ModuleMetadata } from "@nestjs/common";

import { PRISMA_MODULE_CONFIG } from "./constants";
import { PrismaService } from "./prisma.service";

const defaultProviders = [Logger];

@Module({
  providers: [...defaultProviders, PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {
  static async forRootAsync(config: PrismaAsyncModuleConfig): Promise<DynamicModule> {
    const configProvider = {
      provide: PRISMA_MODULE_CONFIG,
      useFactory: async (...args) => {
        return await config.useFactory(...args);
      },
      inject: config.inject || [],
    };

    return {
      global: true,
      module: PrismaModule,
      imports: [...(config.imports || [])],
      providers: [...defaultProviders, configProvider],
      exports: [configProvider],
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
