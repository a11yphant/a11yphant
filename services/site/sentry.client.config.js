import * as Sentry from "@sentry/nextjs";
import getConfig from "next/config";

const config = getConfig();

Sentry.init({
  dsn: config.publicRuntimeConfig.sentryDsn,
  tracesSampleRate: 1.0,
  release: config.publicRuntimeConfig.version,
  environment: config.publicRuntimeConfig.environment,
});
