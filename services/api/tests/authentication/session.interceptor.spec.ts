import { createMock } from "@golevelup/ts-jest";
import { CallHandler, ExecutionContext } from "@nestjs/common";
import { Request, Response } from "express";
import { of } from "rxjs";

import { Context } from "@/authentication/context.interface";
import { JwtService } from "@/authentication/jwt.service";
import { SessionInterceptor } from "@/authentication/session.interceptor";

describe("session interceptor", () => {
  it("handles requests", () => {
    const executionContext = createMock<ExecutionContext>();
    const handle = jest.fn();

    const interceptor = new SessionInterceptor(createMock<JwtService>());

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
    };
    const executionContext = createMock<ExecutionContext>({
      getArgs: jest.fn().mockReturnValue([null, null, context]),
    });

    const handle = jest.fn(() => of("something"));

    const interceptor = new SessionInterceptor(
      createMock<JwtService>({
        createSignedToken: jest.fn().mockResolvedValue("token"),
        validateToken: jest.fn().mockResolvedValue(false),
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
            expect(cookie).toHaveBeenCalledWith("a11yphant_session", expect.anything(), expect.anything());
          },
          complete() {
            expect(cookie).toHaveBeenCalledTimes(1);
            done();
          },
        }),
      );
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
    };
    const executionContext = createMock<ExecutionContext>({
      getArgs: jest.fn().mockReturnValue([null, null, context]),
    });

    const handle = jest.fn(() => of("something"));

    const token = "signed-token";
    const createSignedToken = jest.fn().mockResolvedValue(token);
    const interceptor = new SessionInterceptor(
      createMock<JwtService>({
        createSignedToken,
        validateToken: jest.fn().mockResolvedValue(false),
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
            expect(cookie).toHaveBeenCalledWith(expect.any(String), token, expect.anything());
          },
          complete() {
            done();
          },
        }),
      );
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
    };
    const executionContext = createMock<ExecutionContext>({
      getArgs: jest.fn().mockReturnValue([null, null, context]),
    });

    const handle = jest.fn(() => of("something"));

    const interceptor = new SessionInterceptor(
      createMock<JwtService>({
        createSignedToken: jest.fn().mockResolvedValue("token"),
        validateToken: jest.fn().mockResolvedValue(false),
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
            expect(cookie).toHaveBeenCalled();
          },
          complete() {
            done();
          },
        }),
      );
  });
});
