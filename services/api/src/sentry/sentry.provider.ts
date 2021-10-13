import { Provider } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { GraphqlInterceptor } from "@ntegral/nestjs-sentry";

export const SentryProvider: Provider = {
  provide: APP_INTERCEPTOR,
  useFactory: () => new GraphqlInterceptor(),
};
