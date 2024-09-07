import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthenticationModuleLite } from "./authentication/authentication.lite.module";
import apiConfig from "./config/api.config";
import cookieConfig from "./config/cookie.config";
import databaseConfig from "./config/database.config";
import gqlConfig from "./config/gql.config";
import mailConfig from "./config/mail.config";
import nodeConfig from "./config/node.config";
import oauthConfig from "./config/oauth.config";
import siteConfig from "./config/site.config";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModuleLite } from "./user/user.lite.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [apiConfig, cookieConfig, gqlConfig, mailConfig, nodeConfig, databaseConfig, oauthConfig, siteConfig],
      ignoreEnvFile: process.env.IGNORE_ENV_FILE === "true",
    }),
    PrismaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        databaseUrl: config.get<string>("database.url"),
      }),
      inject: [ConfigService],
    }),
    AuthenticationModuleLite,
    // ChallengeModuleLite,
    // SubmissionModuleLite,
    UserModuleLite,
  ],
  providers: [Logger],
})
export class AppModuleLite {}
