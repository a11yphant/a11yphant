import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { UserModule } from "@/user/user.module";

import { AuthenticationController } from "./authentication.controller";
import { AuthenticationResolver } from "./authentication.resolver";
import { AuthenticationService } from "./authentication.service";
import { HashService } from "./hash.service";
import { JwtService } from "./jwt.service";
import { SessionInterceptor } from "./session.interceptor";
import { StoreService } from "./store.service";
import { GithubStrategy } from "./strategies/github.strategy";
import { TwitterStrategy } from "./strategies/twitter.strategy";

@Module({
  imports: [ConfigModule, UserModule],
  providers: [
    AuthenticationResolver,
    AuthenticationService,
    GithubStrategy,
    HashService,
    JwtService,
    Logger,
    SessionInterceptor,
    StoreService,
    TwitterStrategy,
  ],
  controllers: [AuthenticationController],
  exports: [SessionInterceptor, HashService],
})
export class AuthenticationModule {}
