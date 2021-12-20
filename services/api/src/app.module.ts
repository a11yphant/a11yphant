import { AwsMessagingModule } from "@a11yphant/nestjs-aws-messaging";
import { Logger, Module, ModuleMetadata } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { GraphqlInterceptor, SentryModule } from "@ntegral/nestjs-sentry";
import { LogLevel } from "@sentry/types";
import { ConsoleModule } from "nestjs-console";

import { AuthenticationModule } from "./authentication/authentication.module";
import { SessionInterceptor } from "./authentication/session.interceptor";
import { ChallengeModule } from "./challenge/challenge.module";
import apiConfig from "./config/api.config";
import cookieConfig from "./config/cookie.config";
import databaseConfig from "./config/database.config";
import gqlConfig from "./config/gql.config";
import mailConfig from "./config/mail.config";
import messagingConfig from "./config/messaging.config";
import nodeConfig from "./config/node.config";
import oauthConfig from "./config/oauth.config";
import sentryConfig from "./config/sentry.config";
import siteConfig from "./config/site.config";
import { ImporterModule } from "./importer/importer.module";
import { MailModule } from "./mail/mail.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SubmissionModule } from "./submission/submission.module";
import { LastSeenInterceptor } from "./user/last-seen.interceptor";
import { UserModule } from "./user/user.module";

export const appModuleMetadata: ModuleMetadata = {
  imports: [
    ConfigModule.forRoot({
      load: [apiConfig, cookieConfig, gqlConfig, mailConfig, nodeConfig, databaseConfig, messagingConfig, oauthConfig, sentryConfig, siteConfig],
      ignoreEnvFile: process.env.IGNORE_ENV_FILE === "true",
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
        cors: {
          credentials: true,
          origin: true,
        },
        context: ({ req, res }) => ({ req, res }),
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
    MailModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new GraphqlInterceptor(),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SessionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LastSeenInterceptor,
    },
  ],
};
@Module(appModuleMetadata)
export class AppModule {}
