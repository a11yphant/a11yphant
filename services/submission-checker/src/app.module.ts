import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import fetch from "node-fetch";

import { ElementContainsText } from "@/checks/element-contains-text.check";
import { ElementNotContainsText } from "@/checks/element-not-contains-text.check";

import { CheckFactory } from "./check.factory";
import { CheckSubmissionService } from "./check-submission.service";
import { CHECK_TO_CLASS_MAP, checkToClassMap } from "./check-to-class-map";
import { AVAILABLE_AXE_CHECKS, buildCheckProviders } from "./checks/axe-checks";
import { DocumentLanguageIsSpecified } from "./checks/document-language-is-specified.check";
import { DocumentStartsWithHtml5Doctype } from "./checks/document-starts-with-html5-doctype.check";
import { ElementExists } from "./checks/element-exists.check";
import { ElementNotExists } from "./checks/element-not-exists.check";
import { HtmlIsValidCheck } from "./checks/html-is-valid.check";
import messagingConfig from "./config/messaging.config";
import submissionRenderer from "./config/submission-checker.config";
import { SUBMISSIONS_CLIENT } from "./constants";
import { SubmissionController } from "./submission.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [submissionRenderer, messagingConfig],
      ignoreEnvFile: process.env.IGNORE_ENV_FILE === "true",
    }),
    ClientsModule.registerAsync([
      {
        name: SUBMISSIONS_CLIENT,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>("messaging.rabbitmq-url")],
            queue: config.get<string>("messaging.publish-queue-name"),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [SubmissionController],
  providers: [
    CheckSubmissionService,
    Logger,
    { provide: "fetch", useValue: fetch },
    { provide: CHECK_TO_CLASS_MAP, useValue: checkToClassMap },
    CheckFactory,
    HtmlIsValidCheck,
    ElementExists,
    ElementNotExists,
    ElementContainsText,
    ElementNotContainsText,
    DocumentStartsWithHtml5Doctype,
    DocumentLanguageIsSpecified,
    ...buildCheckProviders(AVAILABLE_AXE_CHECKS),
  ],
})
export class AppModule {}
