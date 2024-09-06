import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";

import { SendPasswordResetMailContext } from "./send-password-reset-mail-context.interface";
import { SendRegistrationMailContext } from "./send-registration-mail-context.interface";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
    private readonly logger: Logger,
  ) {}

  async sendRegistrationMail(context: SendRegistrationMailContext): Promise<void> {
    this.logger.log(`Sending registration mail to ${context.email}`);

    const confirmationLink = await this.generateConfirmationLink(context.token);

    try {
      await this.mailerService.sendMail({
        to: context.email,
        subject: "Confirm your E-Mail",
        template: "registration",
        context: {
          displayName: context.displayName || context.email,
          confirmationLink,
        },
      });

      this.logger.log(`Successfully sent mail to ${context.email}`);
    } catch (error) {
      this.logger.error(`Encountered error while sending registration mail to ${context.email}: ${error.message}`);
    }
  }

  async sendPasswordResetMail(context: SendPasswordResetMailContext): Promise<void> {
    this.logger.log(`Sending password reset mail to ${context.email}`);

    const passwordResetLink = await this.generatePasswordResetLink(context.token);

    try {
      await this.mailerService.sendMail({
        to: context.email,
        subject: "Reset your password",
        template: "password-reset",
        context: {
          passwordResetLink,
        },
      });

      this.logger.log(`Successfully sent mail to ${context.email}`);
    } catch (error) {
      this.logger.error(`Encountered error while sending password reset mail to ${context.email}: ${error.message}`);
    }
  }

  async generateConfirmationLink(token: string): Promise<string> {
    const url = this.config.get<string>("api.url");

    return `${url}/auth/confirm?code=${token}`;
  }

  async generatePasswordResetLink(token: string): Promise<string> {
    const url = this.config.get<string>("site.url");

    return `${url}/reset-password?token=${token}`;
  }
}
