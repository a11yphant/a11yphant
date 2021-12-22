import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";

import { AuthenticationService } from "@/authentication/authentication.service";
import { User } from "@/user/models/user.model";

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
    private authService: AuthenticationService,
    private logger: Logger,
  ) {}

  async sendRegistrationMail(user: User): Promise<void> {
    this.logger.log(`Sending registration Mail to ${user.email}`);

    const confirmationLink = await this.generateConfirmationLink(user);

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: "Confirm your E-Mail",
        template: "./registration",
        context: {
          displayName: user.displayName || user.email,
          confirmationLink,
        },
      });

      this.logger.log(`Successfully sent Mail to ${user.email}`);
    } catch (error) {
      this.logger.error(`Encountered Error while sending registration mail to ${user.email}: ${error.message}`);
    }
  }

  async generateConfirmationLink(user: User): Promise<string> {
    const token = await this.authService.generateMailConfirmationToken(user.id);
    const url = this.config.get<string>("api.url");

    return `${url}/auth/confirm?code=${token}`;
  }
}
