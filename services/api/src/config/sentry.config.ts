import { registerAs } from "@nestjs/config";
import { LogLevel } from "@sentry/types";

export default registerAs("sentry", () => ({
  dsn: process.env.API_SENTRY_DSN,
  environment: process.env.API_SENTRY_ENVIRONMENT,
  "log-level": LogLevel.Error,
  "traces-sample-rate": 1,
}));