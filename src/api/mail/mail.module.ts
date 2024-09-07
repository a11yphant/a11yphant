import { Logger, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { MailService } from "./mail.service";
import { SendMailService } from "./sendMail.service";

@Module({
  providers: [SendMailService, MailService, Logger, ConfigService],
  exports: [MailService],
})
export class MailModule {}
