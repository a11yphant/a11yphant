import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import path from "path";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>("mail.smtp.endpoint"),
          port: config.get<number>("mail.smtp.port"),
          secure: false, // upgrade to TLS later with STARTTLS
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
  ],
  providers: [],
})
export class MailModule {}
