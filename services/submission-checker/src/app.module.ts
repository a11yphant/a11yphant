import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BrowserService } from './browser.service';
import { CheckSubmissionController } from './check-submission.controller';
import { CheckSubmissionService } from './check-submission.service';
import appConfig from './config/app.config';
import submissionRenderer from './config/submission-renderer';
import { RendererController } from './renderer.controller';
import { SubmissionService } from './submission.service';
import { WebdriverFactory } from './webdriver.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, submissionRenderer],
    }),
  ],
  controllers: [CheckSubmissionController, RendererController],
  providers: [
    BrowserService,
    CheckSubmissionService,
    WebdriverFactory,
    SubmissionService,
  ],
})
export class AppModule {}
