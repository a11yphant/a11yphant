import { AwsMessagingModule } from "@a11yphant/nestjs-aws-messaging";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ConsoleModule } from "nestjs-console";

import { AuthenticationModule } from "./authentication/authentication.module";
import { ChallengeModule } from "./challenge/challenge.module";
import apiConfig from "./config/api.config";
import databaseConfig from "./config/database.config";
import gqlConfig from "./config/gql.config";
import messaging from "./config/messaging.config";
import nodeConfig from "./config/node.config";
import oauthConfig from "./config/oauth.config";
import { ImporterModule } from "./importer/importer.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SubmissionModule } from "./submission/submission.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [apiConfig, gqlConfig, nodeConfig, databaseConfig, messaging, oauthConfig],
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        debug: configService.get<boolean>("gql.debug"),
        tracing: configService.get<boolean>("gql.debug"),
        playground: configService.get<boolean>("gql.playground")
          ? {
              settings: {
                "request.credentials": "include",
              },
            }
          : false,
        introspection: configService.get<boolean>("gql.schemaIntrospection"),
        autoSchemaFile: configService.get<boolean>("gql.inMemorySchema") ? true : "schema.gql",
        context: ({ req, res }) => ({ req, res }),
        cors: {
          credentials: true,
          origin: true,
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        databaseUrl: config.get<string>("database.url"),
      }),
      inject: [ConfigService],
    }),
    ConsoleModule,
    AwsMessagingModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        region: config.get<string>("messaging.region"),
        topics: config.get<Record<string, string>>("messaging.topics"),
        snsEndpoint: config.get<string>("messaging.sns-endpoint"),
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule,
    ChallengeModule,
    SubmissionModule,
    ImporterModule,
    UserModule,
  ],
})
export class AppModule {}
