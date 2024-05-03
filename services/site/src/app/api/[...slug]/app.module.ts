import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module, ModuleMetadata } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import { AppController } from "./app.controller";
import { HelloModule } from "./hello.module";

const metadata: ModuleMetadata = {
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: "api/graphql",
    }),
    HelloModule,
  ],
  controllers: [AppController],
};

@Module(metadata)
export class AppModule {}
