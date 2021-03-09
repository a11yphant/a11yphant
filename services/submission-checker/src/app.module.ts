import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BrowserService } from './browser.service';
import { CheckSubmissionController } from './check-submission.controller';
import { CheckSubmissionService } from './check-submission.service';
import submissionRenderer from './config/submission-checker';
import { SubmissionService } from './submission.service';
import { WebdriverFactory } from './webdriver.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [submissionRenderer],
    }),
  ],
  controllers: [CheckSubmissionController],
  providers: [
    BrowserService,
    CheckSubmissionService,
    WebdriverFactory,
    SubmissionService,
  ],
})
export class AppModule {}
