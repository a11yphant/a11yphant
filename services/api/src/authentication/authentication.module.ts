import { Module } from "@nestjs/common";

import { SessionInterceptor } from "./session.interceptor";

@Module({
  imports: [],
  providers: [SessionInterceptor],
})
export class AuthenticationModule {}
