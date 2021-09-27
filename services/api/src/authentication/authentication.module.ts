import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { UserModule } from "@/user/user.module";

import { AuthenticationController } from "./authentication.controller";
import { JwtService } from "./jwt.service";
import { SessionInterceptor } from "./session.interceptor";
import { GithubStrategy } from "./strategies/github.strategy";

@Module({
  imports: [ConfigModule, UserModule],
  providers: [SessionInterceptor, JwtService, GithubStrategy, Logger],
  controllers: [AuthenticationController],
  exports: [SessionInterceptor],
})
export class AuthenticationModule {}
