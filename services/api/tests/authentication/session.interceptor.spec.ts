import { createMock } from "@golevelup/ts-jest";
import { CallHandler, ExecutionContext } from "@nestjs/common";
import { UserFactory } from "@tests/factories/models/user.factory";
import { Request, Response } from "express";
import { of } from "rxjs";

import { Context } from "@/authentication/context.interface";
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
  interceptor
    .intercept(
      executionContext,
      createMock<CallHandler>({ handle }),
    )
    .then((observable) =>
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
  it("handles requests", () => {
    const executionContext = createMock<ExecutionContext>();
    const handle = jest.fn();

    const interceptor = new SessionInterceptor(
      createMock<JwtService>(),
      createMock<UserService>({
        create: jest.fn().mockResolvedValue(UserFactory.build()),
      }),
    );

    interceptor.intercept(
      executionContext,
      createMock<CallHandler>({ handle }),
    );

    expect(handle).toHaveBeenCalledTimes(1);
  });

  it("adds a session cookie to graphql requests", (done) => {
    const cookie = jest.fn();
    const context: Context = {
      req: createMock<Request>({
        originalUrl: "/graphql",
      }),
      res: createMock<Response>({
        cookie,
      }),
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
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
    const cookie = jest.fn();
    const context: Context = {
      req: createMock<Request>({
        originalUrl: "/graphql",
      }),
      res: createMock<Response>({
        cookie,
      }),
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
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
    const cookie = jest.fn();
    const context: Context = {
      req: createMock<Request>({
        originalUrl: "/graphql",
        cookies: { a11yphant_session: "cookie" as any },
      }),
      res: createMock<Response>({
        cookie,
      }),
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
      getArgs: jest.fn().mockReturnValue([null, null, context]),
    });

    const handle = jest.fn(() => of("something"));

    const interceptor = new SessionInterceptor(
      createMock<JwtService>({
        createSignedToken: jest.fn().mockResolvedValue("token"),
        validateToken: jest.fn().mockResolvedValue(true),
      }),
      createMock<UserService>({
        create: jest.fn().mockResolvedValue(UserFactory.build()),
      }),
    );

    interceptor
      .intercept(
        executionContext,
        createMock<CallHandler>({ handle }),
      )
      .then((observable) =>
        observable.subscribe({
          next() {
            expect(cookie).not.toHaveBeenCalled();
          },
          complete() {
            done();
          },
        }),
      );
  });

  it("overwrites the session cookie if it is invalid", (done) => {
    const cookie = jest.fn();
    const context: Context = {
      req: createMock<Request>({
        originalUrl: "/graphql",
        cookies: { a11yphant_session: "cookie" as any },
      }),
      res: createMock<Response>({
        cookie,
      }),
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
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
    const cookie = jest.fn();
    const context: Context = {
      req: createMock<Request>({
        originalUrl: "/graphql",
      }),
      res: createMock<Response>({
        cookie,
      }),
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
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
    const cookie = jest.fn();
    const context: Context = {
      req: createMock<Request>({
        originalUrl: "/graphql",
      }),
      res: createMock<Response>({
        cookie,
      }),
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
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
    const cookie = jest.fn();
    const context: Context = {
      req: createMock<Request>({
        originalUrl: "/graphql",
      }),
      res: createMock<Response>({
        cookie,
      }),
      sessionToken: null,
    };
    const executionContext = createMock<ExecutionContext>({
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
      expect(context.sessionToken.userId).toBeTruthy();
    };

    runInterceptor(interceptor, executionContext, doNothing, completeCallback, done);
  });
});
