import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import submissionRenderer from './config/submission-renderer.config';
import { RendererController } from './renderer.controller';
import { SubmissionService } from './submission.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [submissionRenderer],
    }),
  ],
  controllers: [RendererController],
  providers: [SubmissionService, Logger],
})
export class AppModule {}
