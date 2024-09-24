import "server-only";

import { INestApplication, Type } from "@nestjs/common";
import { getApp } from "app/api/main";

let app: INestApplication<any>;

export async function getService<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | Function | string | symbol): Promise<TResult> {
  if (!app) {
    app = await getApp();
  }

  return app.get<TInput, TResult>(typeOrToken);
}
