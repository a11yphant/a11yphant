import { FactoryProvider, ModuleMetadata } from "@nestjs/common";

export interface PrismaModuleConfig {
  databaseUrl: string;
}

export interface PrismaAsyncModuleConfig extends Pick<ModuleMetadata, "imports"> {
  useFactory: (...args: any[]) => PrismaModuleConfig | Promise<PrismaModuleConfig>;
  inject?: FactoryProvider["inject"];
}
