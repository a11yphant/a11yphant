/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Logger } from "@nestjs/common";

export class NoopLogger extends Logger {
  public log(message: any, context?: string | undefined): void;
  public log(message: any, ...optionalParams: any[]): void;
  public log(message: unknown, context?: unknown, ...rest: unknown[]): void {}

  public debug(message: any, context?: string): void;
  public debug(message: any, ...optionalParams: any[]): void;
  public debug(message: unknown, context?: unknown, ...rest: unknown[]): void {}

  public verbose(message: any, context?: string): void;
  public verbose(message: any, ...optionalParams: any[]): void;
  public verbose(message: unknown, context?: unknown, ...rest: unknown[]): void {}

  public warn(message: any, context?: string): void;
  public warn(message: any, ...optionalParams: any[]): void;
  public warn(message: unknown, context?: unknown, ...rest: unknown[]): void {}

  public error(message: any, stack?: string, context?: string): void;
  public error(message: any, ...optionalParams: any[]): void;
  public error(message: unknown, stack?: unknown, context?: unknown, ...rest: unknown[]): void {}
}
