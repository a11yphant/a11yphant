import { Module } from "@nestjs/common";

import { HelloWorldResolver } from "./hello-world.resolver";
import { HelloWorldService } from "./hello-world.service";

@Module({
  providers: [HelloWorldResolver, HelloWorldService],
})
export class HelloWorldModule {}
