import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { JwtService } from "./jwt.service";
import { SessionInterceptor } from "./session.interceptor";

@Module({
  imports: [ConfigModule],
  providers: [SessionInterceptor, JwtService],
  exports: [SessionInterceptor],
})
export class AuthenticationModule {}
