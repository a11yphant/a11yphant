import { Injectable } from "@nestjs/common";
import * as uuid from "uuid";

import { HelloWorld } from "./models/hello-world.model";

@Injectable()
export class HelloWorldService {
  async findAll(): Promise<HelloWorld[]> {
    return [
      {
        id: uuid.v4(),
        message: "Hello",
      },
      {
        id: uuid.v4(),
        message: "World",
      },
    ];
  }
}
