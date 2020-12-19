import { Query, Resolver } from '@nestjs/graphql';
import { HelloWorld } from './models/hello-world.model';
import { HelloWorldService } from './hello-world.service';

@Resolver()
export class HelloWorldResolver {
  constructor(private readonly helloWorldService: HelloWorldService) {}

  @Query(() => [HelloWorld])
  async helloWorld(): Promise<HelloWorld[]> {
    return this.helloWorldService.findAll();
  }
}
