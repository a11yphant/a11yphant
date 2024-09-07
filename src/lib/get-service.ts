import "server-only";

import { INestApplication, Type } from "@nestjs/common";
import { bootstrap } from "app/api/lite";

let app: INestApplication<any>;

export async function getService<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | Function | string | symbol): Promise<TResult> {
  if (!app) {
    app = await bootstrap();
  }

  return app.get<TInput, TResult>(typeOrToken);
}
