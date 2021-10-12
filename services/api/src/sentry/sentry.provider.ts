import { Provider } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { SentryInterceptor } from "./sentry.interceptor";

export const SentryProvider: Provider = {
  provide: APP_INTERCEPTOR,
  useFactory: () => new SentryInterceptor(),
};
