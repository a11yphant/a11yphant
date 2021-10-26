import { AwsMessagingModule } from "@a11yphant/nestjs-aws-messaging";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import fetch from "node-fetch";

import { BrowserService } from "./browser.service";
import { CheckFactory } from "./check.factory";
import { CheckSubmissionService } from "./check-submission.service";
import { CHECK_TO_CLASS_MAP, checkToClassMap } from "./check-to-class-map";
import { AVAILABLE_AXE_CHECKS, buildCheckProviders } from "./checks/axe-checks";
import { ElementExists } from "./checks/element-exists.check";
import { ElementNotExists } from "./checks/element-not-exists.check";
import { HtmlIsValidCheck } from "./checks/html-is-valid.check";
import messagingConfig from "./config/messaging.config";
import submissionRenderer from "./config/submission-checker.config";
import { SubmissionController } from "./submission.controller";
import { WebdriverFactory } from "./webdriver.factory";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [submissionRenderer, messagingConfig],
    }),
    AwsMessagingModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        region: config.get<string>("messaging.region"),
        topics: config.get<Record<string, string>>("messaging.topics"),
        snsEndpoint: config.get<string>("messaging.sns-endpoint"),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SubmissionController],
  providers: [
    BrowserService,
    CheckSubmissionService,
    WebdriverFactory,
    Logger,
    { provide: "fetch", useValue: fetch },
    { provide: CHECK_TO_CLASS_MAP, useValue: checkToClassMap },
    CheckFactory,
    HtmlIsValidCheck,
    ElementExists,
    ElementNotExists,
    ...buildCheckProviders(AVAILABLE_AXE_CHECKS),
  ],
})
export class AppModule {}
