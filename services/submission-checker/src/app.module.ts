import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BrowserService } from './browser.service';
import { CheckSubmissionController } from './check-submission.controller';
import { CheckSubmissionService } from './check-submission.service';
import submissionRenderer from './config/submission-renderer';
import { RendererModule } from './renderer/renderer.module';
import { WebdriverFactory } from './webdriver.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [submissionRenderer],
    }),
    RendererModule
  ],
  controllers: [
    CheckSubmissionController
  ],
  providers: [
    BrowserService,
    CheckSubmissionService,
    WebdriverFactory
  ],
})
export class AppModule {}