import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BrowserService } from './browser.service';
import { CheckSubmissionController } from './check-submission.controller';
import { CheckSubmissionService } from './check-submission.service';
import submissionRenderer from './config/submission-renderer';
import { WebdriverFactory } from './webdriver.factory';
import appConfig from './config/app.config';
import { SubmissionService } from './submission.service';
import { RendererController } from './renderer.controller';

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
