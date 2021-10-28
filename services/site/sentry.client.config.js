import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SITE_SENTRY_DSN,
  tracesSampleRate: 1.0,
  release: process.env.NEXT_PUBLIC_SITE_VERSION,
  environment: process.env.NEXT_PUBLIC_SITE_ENVIRONMENT,
});
