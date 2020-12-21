import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import submissionRenderer from './config/submission-renderer';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [submissionRenderer],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
