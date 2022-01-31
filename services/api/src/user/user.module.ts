import { forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AuthenticationModule } from "@/authentication/authentication.module";
import { MailModule } from "@/mail/mail.module";
import { PrismaModule } from "@/prisma/prisma.module";

import { DeleteStaleUsers } from "./delete-stale-users.console";
import { LastSeenInterceptor } from "./last-seen.interceptor";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [PrismaModule, forwardRef(() => AuthenticationModule), MailModule],
  providers: [ConfigService, UserService, UserResolver, Logger, LastSeenInterceptor, DeleteStaleUsers],
  exports: [UserService, LastSeenInterceptor],
})
export class UserModule {}
