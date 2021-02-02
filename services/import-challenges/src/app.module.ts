import { Module } from '@nestjs/common';

import { YamlReaderService } from './yaml-reader.service';

@Module({
  imports: [],
  providers: [YamlReaderService],
})
export class AppModule {}
