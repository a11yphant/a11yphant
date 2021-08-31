import { createMock } from "@golevelup/ts-jest";
import { CallHandler, ExecutionContext } from "@nestjs/common";
import { UserFactory } from "@tests/factories/models/user.factory";
import { Request, Response } from "express";
import { of } from "rxjs";

import { Context } from "@/authentication/interfaces/context.interface";
import { JwtService } from "@/authentication/jwt.service";
import { SessionInterceptor } from "@/authentication/session.interceptor";
import { UserService } from "@/user/user.service";

const doNothing = (): void => {
  // do nothing
};

function runInterceptor(
  interceptor: SessionInterceptor,
  executionContext: ExecutionContext,
  nextCallback: () => void,
  completeCallback: () => void,
  done: any,
): void {
  const handle = jest.fn(() => of("something"));
  interceptor.intercept(executionContext, createMock<CallHandler>({ handle })).then((observable) =>
    observable.subscribe({
      next() {
        nextCallback();
      },
      complete() {
        completeCallback();
        done();
      },
    }),
  );
}

describe("session interceptor", () => {
  it("handles normal requests", (done) => {
    expect.assertions(1);
    const executionContext = createMock<ExecutionContext>();

    const interceptor = new SessionInterceptor(createMock<JwtService>(), createMock<UserService>());

    const completeCallback = (): void => {
      // check if this callback has been executed
      expect(true).toBeTruthy();
    };

    runInterceptor(interceptor, executionContext, doNothing, completeCallback, done);
  });

  it("adds a session cookie to graphql requests", (done) => {
    expect.assertions(2);
    const cookie = jest.fn();
    const context: Context = {
      req: createMock<Request>(),
      res: createMock<Response>({
        cookie,
      }),
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
      getType: jest.fn().mockReturnValue("graphql"),
      getArgs: jest.fn().mockReturnValue([null, null, context]),
    });

    const interceptor = new SessionInterceptor(
      createMock<JwtService>({
        createSignedToken: jest.fn().mockResolvedValue("token"),
        validateToken: jest.fn().mockResolvedValue(false),
      }),
      createMock<UserService>({
        create: jest.fn().mockResolvedValue(UserFactory.build()),
      }),
    );

    const nextCallback = (): void => {
      expect(cookie).toHaveBeenCalledWith("a11yphant_session", expect.anything(), expect.anything());
    };

    const completeCallback = (): void => {
      expect(cookie).toHaveBeenCalledTimes(1);
    };

    runInterceptor(interceptor, executionContext, nextCallback, completeCallback, done);
  });

  it("the session cookie contains a signed jwt", (done) => {
    expect.assertions(1);
    const cookie = jest.fn();
    const context: Context = {
      req: createMock<Request>(),
      res: createMock<Response>({
        cookie,
      }),
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
      getType: jest.fn().mockReturnValue("graphql"),
      getArgs: jest.fn().mockReturnValue([null, null, context]),
    });

    const token = "signed-token";
    const createSignedToken = jest.fn().mockResolvedValue(token);
    const interceptor = new SessionInterceptor(
      createMock<JwtService>({
        createSignedToken,
        validateToken: jest.fn().mockResolvedValue(false),
      }),
      createMock<UserService>({
        create: jest.fn().mockResolvedValue(UserFactory.build()),
      }),
    );

    const nextCallback = (): void => {
      expect(cookie).toHaveBeenCalledWith(expect.any(String), token, expect.anything());
    };

    runInterceptor(interceptor, executionContext, nextCallback, doNothing, done);
  });

  it("does not set a new cookie if a cookie already exists", (done) => {
    expect.assertions(1);
    const cookie = jest.fn();
    const context: Context = {
      req: createMock<Request>({
        cookies: { a11yphant_session: "cookie" as any },
      }),
      res: createMock<Response>({
        cookie,
      }),
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
      getType: jest.fn().mockReturnValue("graphql"),
      getArgs: jest.fn().mockReturnValue([null, null, context]),
    });

    const interceptor = new SessionInterceptor(
      createMock<JwtService>({
        createSignedToken: jest.fn().mockResolvedValue("token"),
        validateToken: jest.fn().mockResolvedValue(true),
      }),
      createMock<UserService>({
        create: jest.fn().mockResolvedValue(UserFactory.build()),
      }),
    );

    const nextCallback = (): void => {
      expect(cookie).not.toHaveBeenCalled();
    };

    runInterceptor(interceptor, executionContext, nextCallback, doNothing, done);
  });

  it("overwrites the session cookie if it is invalid", (done) => {
    expect.assertions(1);
    const cookie = jest.fn();
    const context: Context = {
      req: createMock<Request>({
        cookies: { a11yphant_session: "cookie" as any },
      }),
      res: createMock<Response>({
        cookie,
      }),
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
      getType: jest.fn().mockReturnValue("graphql"),
      getArgs: jest.fn().mockReturnValue([null, null, context]),
    });

    const interceptor = new SessionInterceptor(
      createMock<JwtService>({
        createSignedToken: jest.fn().mockResolvedValue("token"),
        validateToken: jest.fn().mockResolvedValue(false),
      }),
      createMock<UserService>({
        create: jest.fn().mockResolvedValue(UserFactory.build()),
      }),
    );

    const nextCallback = (): void => {
      expect(cookie).toHaveBeenCalled();
    };

    runInterceptor(interceptor, executionContext, nextCallback, doNothing, done);
  });

  it("adds the decoded session token to the context", (done) => {
    expect.assertions(1);
    const cookie = jest.fn();
    const context: Context = {
      req: createMock<Request>(),
      res: createMock<Response>({
        cookie,
      }),
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
      getType: jest.fn().mockReturnValue("graphql"),
      getArgs: jest.fn().mockReturnValue([null, null, context]),
    });

    const interceptor = new SessionInterceptor(
      createMock<JwtService>({
        createSignedToken: jest.fn().mockResolvedValue("token"),
        validateToken: jest.fn().mockResolvedValue(true),
        decodeToken: jest.fn().mockReturnValue({ payload: "something" }),
      }),
      createMock<UserService>({
        create: jest.fn().mockResolvedValue(UserFactory.build()),
      }),
    );

    const completeCallback = (): void => {
      expect(context.sessionToken).toBeTruthy();
    };

    runInterceptor(interceptor, executionContext, doNothing, completeCallback, done);
  });

  it("adds the session token to the context when creating a new session", (done) => {
    expect.assertions(1);
    const cookie = jest.fn();
    const context: Context = {
      req: createMock<Request>(),
      res: createMock<Response>({
        cookie,
      }),
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
      getType: jest.fn().mockReturnValue("graphql"),
      getArgs: jest.fn().mockReturnValue([null, null, context]),
    });

    const interceptor = new SessionInterceptor(
      createMock<JwtService>({
        createSignedToken: jest.fn().mockResolvedValue("token"),
        validateToken: jest.fn().mockResolvedValue(false),
      }),
      createMock<UserService>({
        create: jest.fn().mockResolvedValue(UserFactory.build()),
      }),
    );

    const completeCallback = (): void => {
      expect(context.sessionToken).toBeTruthy();
    };

    runInterceptor(interceptor, executionContext, doNothing, completeCallback, done);
  });

  it("creates a new user for new sessions", (done) => {
    expect.assertions(1);
    const cookie = jest.fn();
    const context: Context = {
      req: createMock<Request>(),
      res: createMock<Response>({
        cookie,
      }),
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
      getType: jest.fn().mockReturnValue("graphql"),
      getArgs: jest.fn().mockReturnValue([null, null, context]),
    });

    const interceptor = new SessionInterceptor(
      createMock<JwtService>({
        createSignedToken: jest.fn().mockResolvedValue("token"),
        validateToken: jest.fn().mockResolvedValue(false),
      }),
      createMock<UserService>({
        create: jest.fn().mockResolvedValue(UserFactory.build()),
      }),
    );

    const completeCallback = (): void => {
      expect(context.sessionToken?.userId).toBeTruthy();
    };

    runInterceptor(interceptor, executionContext, doNothing, completeCallback, done);
  });
});
