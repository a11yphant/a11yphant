import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";

import { ChallengeModule } from "./challenge/challenge.module";
import apiConfig from "./config/api.config";
import gqlConfig from "./config/gql.config";
import nodeConfig from "./config/node.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [apiConfig, gqlConfig, nodeConfig],
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        debug: configService.get<boolean>("gql.debug"),
        playground: configService.get<boolean>("gql.playground"),
        introspection: configService.get<boolean>("gql.schemaIntrospection"),
        autoSchemaFile: configService.get<boolean>("gql.inMemorySchema") ? true : "schema.gql",
        context: ({ req }) => ({ ...req }),
        cors: {
          credentials: true,
          origin: true,
        },
      }),
      inject: [ConfigService],
    }),
    ChallengeModule,
  ],
})
export class AppModule {}
