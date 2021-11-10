import { forwardRef, Logger, Module } from "@nestjs/common";

import { AuthenticationModule } from "@/authentication/authentication.module";
import { PrismaModule } from "@/prisma/prisma.module";

import { DeleteStaleUsers } from "./delete-stale-users.console";
import { LastSeenInterceptor } from "./last-seen.interceptor";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [PrismaModule, forwardRef(() => AuthenticationModule)],
  providers: [UserService, UserResolver, Logger, LastSeenInterceptor, DeleteStaleUsers],
  exports: [UserService, LastSeenInterceptor],
})
export class UserModule {}
