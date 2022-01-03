import { forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AuthenticationModule } from "@/authentication/authentication.module";
import { MailService } from "@/mail/mail.service";
import { PrismaModule } from "@/prisma/prisma.module";

import { DeleteStaleUsers } from "./delete-stale-users.console";
import { LastSeenInterceptor } from "./last-seen.interceptor";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [PrismaModule, forwardRef(() => AuthenticationModule)],
  providers: [ConfigService, MailService, UserService, UserResolver, Logger, LastSeenInterceptor, DeleteStaleUsers],
  exports: [UserService, LastSeenInterceptor],
})
export class UserModule {}
