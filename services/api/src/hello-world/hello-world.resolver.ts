import { Query, Resolver } from '@nestjs/graphql';
import { HelloWorld } from './models/hello-world.model';
import * as uuid from 'uuid';

@Resolver()
export class HelloWorldResolver {
  @Query(() => HelloWorld)
  async helloWorld(): Promise<HelloWorld> {
    return { id: uuid.v4(), message: 'Hello World!' };
  }
}
