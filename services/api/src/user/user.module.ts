import { forwardRef, Logger, Module } from "@nestjs/common";

import { AuthenticationModule } from "@/authentication/authentication.module";
import { PrismaModule } from "@/prisma/prisma.module";

import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [PrismaModule, forwardRef(() => AuthenticationModule)],
  providers: [UserService, UserResolver, Logger],
  exports: [UserService],
})
export class UserModule {}
