import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { UserModule } from "@/user/user.module";

import { JwtService } from "./jwt.service";
import { SessionInterceptor } from "./session.interceptor";

@Module({
  imports: [ConfigModule, UserModule],
  providers: [SessionInterceptor, JwtService],
  exports: [SessionInterceptor],
})
export class AuthenticationModule {}
