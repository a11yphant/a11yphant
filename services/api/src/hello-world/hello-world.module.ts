import { Module } from '@nestjs/common';
import { HelloWorldResolver } from './hello-world.resolver';

@Module({
  providers: [HelloWorldResolver],
})
export class HelloWorldModule {}
