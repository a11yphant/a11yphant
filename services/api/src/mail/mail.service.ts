import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";

import { JwtService } from "@/authentication/jwt.service";
import { User } from "@/user/models/user.model";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private config: ConfigService, private jwtService: JwtService, private logger: Logger) {}

  async sendRegistrationMail(user: User): Promise<void> {
    this.logger.log(`Sending registration Mail to ${user.email}`);

    const confirmationLink = await this.generateConfirmationLink(user);

    await this.mailerService
      .sendMail({
        to: user.email,
        subject: "Confirm your E-Mail",
        template: "./registration",
        context: {
          displayName: user.displayName || user.email,
          confirmationLink,
        },
      })
      .then(() => this.logger.log(`Successfully sent Mail to ${user.email}`))
      .catch((e) => this.logger.error(e.message));
  }

  async generateConfirmationLink(user: User): Promise<string> {
    const token = await this.jwtService.createSignedToken({}, { expiresInSeconds: 86400, subject: user.id });
    const url = this.config.get<string>("api.url");

    return `${url}/auth/confirm?code=${token}`;
  }
}
