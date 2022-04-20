import { LogLevel } from "@nestjs/common";
import { registerAs } from "@nestjs/config";

const logLevel: LogLevel = "error";

export default registerAs("sentry", () => ({
  dsn: process.env.API_SENTRY_DSN,
  environment: process.env.API_SENTRY_ENVIRONMENT,
  "log-level": logLevel,
  "traces-sample-rate": 1,
}));
