import { Logger, Module } from "@nestjs/common";

import { MailService } from "./mail.service";
import { SendMailService } from "./sendMail.service";

@Module({
  providers: [SendMailService, MailService, Logger],
  exports: [MailService],
})
export class MailModule {}
