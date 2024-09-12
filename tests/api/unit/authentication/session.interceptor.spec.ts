/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserFactory } from "@tests/support/factories/models/user.factory";
import { createConfigServiceMock } from "@tests/support/helpers";
import { runInterceptor } from "@tests/support/helpers";
import { Request } from "express";

import { Context } from "@/authentication/interfaces/context.interface";
import { JwtService } from "@/authentication/jwt.service";
import { SessionInterceptor } from "@/authentication/session.interceptor";
import { UserService } from "@/user/user.service";

const doNothing = (): void => {
  // do nothing
};

describe("session interceptor", () => {
  it("handles regular http requests", (done) => {
    expect.assertions(1);
    const executionContext = createMock<ExecutionContext>();

    const interceptor = new SessionInterceptor(
      createMock<JwtService>(),
      createMock<UserService>(),
      createMock<Logger>(),
      createMock<ConfigService>(createConfigServiceMock()),
    );

    const completeCallback = (): void => {
      // check if this callback has been executed
      expect(true).toBeTruthy();
    };

    runInterceptor(interceptor, executionContext, doNothing, completeCallback, done);
  });

  it("adds the decoded session token to the context", (done) => {
    expect.assertions(1);
    const context: Context = {
      req: createMock<Request>(),
      res: null,
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
      getType: jest.fn().mockReturnValue("graphql"),
      getArgs: jest.fn().mockReturnValue([null, context, null]),
    });

    const interceptor = new SessionInterceptor(
      createMock<JwtService>({
        validateToken: jest.fn().mockResolvedValue(true),
      }),
      createMock<UserService>({
        create: jest.fn().mockResolvedValue(UserFactory.build()),
      }),
      createMock<Logger>(),
      createMock<ConfigService>(createConfigServiceMock()),
    );

    const completeCallback = (): void => {
      expect(context.sessionToken).toBeTruthy();
    };

    runInterceptor(interceptor, executionContext, doNothing, completeCallback, done);
  });

  it("creates a new user for the session if it doesn't exist yet", (done) => {
    expect.assertions(2);
    const context: Context = {
      req: createMock<Request>(),
      res: null,
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
      getType: jest.fn().mockReturnValue("graphql"),
      getArgs: jest.fn().mockReturnValue([null, context, null]),
    });

    const createIfNotExists = jest.fn().mockResolvedValue(UserFactory.build());

    const interceptor = new SessionInterceptor(
      createMock<JwtService>({
        decodeToken: jest.fn().mockReturnValue({ sub: "user-id" }),
      }),
      createMock<UserService>({ createIfNotExists }),
      createMock<Logger>(),
      createMock<ConfigService>(createConfigServiceMock()),
    );

    const completeCallback = (): void => {
      expect(context.sessionToken?.userId).toBeTruthy();
      expect(createIfNotExists).toHaveBeenCalledWith("user-id");
    };

    runInterceptor(interceptor, executionContext, doNothing, completeCallback, done);
  });
});
