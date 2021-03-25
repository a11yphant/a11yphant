import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { BrowserService } from "./browser.service";
import { CheckSubmissionService } from "./check-submission.service";
import messagingConfig from "./config/messaging.config";
import submissionRenderer from "./config/submission-checker.config";
import { SubmissionController } from "./submission.controller";
import { SubmissionService } from "./submission.service";
import { WebdriverFactory } from "./webdriver.factory";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [submissionRenderer, messagingConfig],
    }),
  ],
  controllers: [SubmissionController],
  providers: [BrowserService, CheckSubmissionService, WebdriverFactory, SubmissionService, Logger],
})
export class AppModule {}
