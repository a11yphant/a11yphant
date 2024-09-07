import { forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AuthenticationModuleLite } from "@/authentication/authentication.lite.module";
import { MailModule } from "@/mail/mail.module";
import { PrismaModule } from "@/prisma/prisma.module";

import { UserService } from "./user.service";

@Module({
  imports: [PrismaModule, forwardRef(() => AuthenticationModuleLite), MailModule],
  providers: [ConfigService, UserService, Logger],
  exports: [UserService],
})
export class UserModuleLite {}
