import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import submissionRenderer from './config/submission-renderer';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [submissionRenderer],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}