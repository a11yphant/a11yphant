import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import path from "path";

import { AuthenticationModule } from "@/authentication/authentication.module";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>("mail.smtp.endpoint"),
          port: config.get<number>("mail.smtp.port"),
          secure: false, // secure: false causes smtp to uprade to STARTTLS when available
          auth: {
            user: config.get<string>("mail.smtp.username"),
            pass: config.get<string>("mail.smtp.password"),
          },
        },
        defaults: {
          from: config.get<string>("mail.from"),
        },
        template: {
          dir: path.resolve(__dirname, "..", "..", "mail-templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule,
  ],
  providers: [],
})
export class MailModule {}
