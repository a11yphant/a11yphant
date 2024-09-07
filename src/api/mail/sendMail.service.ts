import { SES } from "@aws-sdk/client-ses";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";

import { SendMailParams } from "./send-mail-params.interface";

@Injectable()
export class SendMailService {
  constructor(private readonly config: ConfigService) {}

  async sendMail(content: JSX.Element, context: SendMailParams): Promise<void> {
    const view = await render(content);

    switch (this.config.get<string>("mail.provider")) {
      case "ses":
        this.sendWithSes(view, context);
        break;
      default:
        this.sendWithSmtp(view, context);
        break;
    }
  }

  private async sendWithSes(content: string, context: SendMailParams): Promise<void> {
    const sesClient = new SES({
      apiVersion: "2010-12-01",
      region: "eu-central-1",
      credentials: defaultProvider(),
    });

    sesClient.sendEmail({
      Source: this.config.get<string>("mail.from"),
      Destination: {
        ToAddresses: [context.to],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: content,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: context.subject,
        },
      },
    });
  }

  private async sendWithSmtp(content: string, context: SendMailParams): Promise<void> {
    const transport = nodemailer.createTransport({
      host: this.config.get<string>("mail.smtp.endpoint"),
      port: this.config.get<number>("mail.smtp.port"),
      secure: false, // secure: false causes smtp to uprade to STARTTLS when available
      auth: {
        user: this.config.get<string>("mail.smtp.username"),
        pass: this.config.get<string>("mail.smtp.password"),
      },
    });

    transport.sendMail({
      from: this.config.get<string>("mail.from"),
      to: context.to,
      subject: context.subject,
      html: content,
    });
  }
}
