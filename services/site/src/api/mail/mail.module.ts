import * as sesSdk from "@aws-sdk/client-ses";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule, MailerOptions } from "@nestjs-modules/mailer";
import nodemailer from "nodemailer";
import path from "path";

import { LiquidAdapter } from "./liquid.adapter";
import { MailService } from "./mail.service";

function getTransport(config: ConfigService): MailerOptions["transport"] {
  if (config.get<string>("mail.provider") === "ses") {
    const sesClient = new sesSdk.SESClient({
      apiVersion: "2010-12-01",
      region: "eu-central-1",
      credentials: defaultProvider(),
    });

    const transport = nodemailer.createTransport({
      SES: { aws: sesSdk, ses: sesClient },
    });

    return transport.transporter;
  }

  return {
    host: config.get<string>("mail.smtp.endpoint"),
    port: config.get<number>("mail.smtp.port"),
    secure: false, // secure: false causes smtp to uprade to STARTTLS when available
    auth: {
      user: config.get<string>("mail.smtp.username"),
      pass: config.get<string>("mail.smtp.password"),
    },
  };
}

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          transport: getTransport(config),
          defaults: {
            from: config.get<string>("mail.from"),
          },
          template: {
            dir: path.resolve(__dirname, "..", "..", "..", "..", "..", "mail-templates"),
            adapter: new LiquidAdapter(),
            tions: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [MailService, Logger],
  exports: [MailService],
})
export class MailModule {}
