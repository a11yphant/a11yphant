import { AwsMessagingModule } from "@a11yphant/nestjs-aws-messaging";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { SentryModule, SentryService } from "@ntegral/nestjs-sentry";
import { LogLevel } from "@sentry/types";
import { ConsoleModule } from "nestjs-console";

import { AuthenticationModule } from "./authentication/authentication.module";
import { ChallengeModule } from "./challenge/challenge.module";
import apiConfig from "./config/api.config";
import cookieConfig from "./config/cookie.config";
import databaseConfig from "./config/database.config";
import gqlConfig from "./config/gql.config";
import messaging from "./config/messaging.config";
import nodeConfig from "./config/node.config";
import oauthConfig from "./config/oauth.config";
import sentryConfig from "./config/sentry.config";
import { ImporterModule } from "./importer/importer.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SentryProvider } from "./sentry/sentry.provider";
import { SentryApolloGraphQLTracingPlugin } from "./sentry/sentry-apollo-graphql-tracing.plugin";
import { SubmissionModule } from "./submission/submission.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [apiConfig, cookieConfig, gqlConfig, nodeConfig, databaseConfig, messaging, oauthConfig, sentryConfig],
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dsn: configService.get<string>("sentry.dsn"),
        environment: configService.get<string>("sentry.environment"),
        logLevel: configService.get<LogLevel>("sentry.logLevel"),
        tracesSampleRate: configService.get<number>("sentry.traces-sample-rate"),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService, sentryService: SentryService) => ({
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
        context: ({ req, res }) => {
          const transaction = sentryService.instance().startTransaction({
            op: "gql",
            name: "GraphQLTransaction", // this will be the default name, unless the gql query has a name
          });
          return { req, res, transaction };
        },
        cors: {
          credentials: true,
          origin: true,
        },
        plugins: [SentryApolloGraphQLTracingPlugin],
      }),
      inject: [ConfigService, SentryService],
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
  providers: [SentryProvider],
})
export class AppModule {}
