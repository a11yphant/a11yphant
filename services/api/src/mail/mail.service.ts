import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

import { User } from "@/user/models/user.model";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private logger: Logger) {}

  async sendRegistrationMail(user: User): Promise<void> {
    this.logger.log(`Sending registration Mail to ${user.email}`);
    await this.mailerService
      .sendMail({
        to: user.email,
        subject: "Confirm your E-Mail",
        template: "./registration",
        context: {
          displayName: user.displayName,
          registrationLink: "https://beta.a11yphant.com",
        },
      })
      .then(() => this.logger.log(`Successfully sent Mail to ${user.email}`))
      .catch((e) => this.logger.error(e.message));
  }
}
