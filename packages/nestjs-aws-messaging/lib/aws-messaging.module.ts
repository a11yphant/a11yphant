import { DynamicModule, FactoryProvider, Logger, Module, ModuleMetadata } from "@nestjs/common";

import { AwsMessagingClient } from "./aws-messaging-client";
import { AWS_MESSAGING_MODULE_CONFIG } from "./constants";

@Module({
  providers: [Logger, AwsMessagingClient],
  exports: [AwsMessagingClient],
})
export class AwsMessagingModule {
  static async forRootAsync(config: AwsMessagingAsyncModuleConfig): Promise<DynamicModule> {
    const configProvider = {
      provide: AWS_MESSAGING_MODULE_CONFIG,
      useFactory: async (...args) => {
        return await config.useFactory(...args);
      },
      inject: config.inject || [],
    };

    return {
      global: true,
      module: AwsMessagingModule,
      imports: [...(config.imports || [])],
      providers: [configProvider],
      exports: [configProvider],
    };
  }
}

export interface AwsMessagingModuleConfig {
  region: string;
  topics: Record<string, string>;
  snsEndpoint?: string;
}

export interface AwsMessagingAsyncModuleConfig extends Pick<ModuleMetadata, "imports"> {
  useFactory: (...args: any[]) => AwsMessagingModuleConfig | Promise<AwsMessagingModuleConfig>;
  inject?: FactoryProvider["inject"];
}
