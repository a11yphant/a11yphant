import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { MailModule } from "@/mail/mail.module";
import { UserModuleLite } from "@/user/user.lite.module";

import { AuthenticationService } from "./authentication.service";
import { HashService } from "./hash.service";
import { JwtService } from "./jwt.service";

@Module({
  imports: [ConfigModule, UserModuleLite, MailModule],
  providers: [AuthenticationService, HashService, JwtService],
  exports: [AuthenticationService, HashService, JwtService],
})
export class AuthenticationModuleLite {}
