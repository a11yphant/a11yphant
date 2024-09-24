/**
 * @jest-environment node
 */

import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { ExecutionContext } from "@nestjs/common";
import { runInterceptor } from "@tests/support/helpers";
import { Request, Response } from "express";

import { Context } from "@/authentication/interfaces/context.interface";
import { LastSeenInterceptor } from "@/user/last-seen.interceptor";
import { UserService } from "@/user/user.service";

const doNothing = (): void => {
  // do nothing
};

const getExecutionContextMock = (userId?: string): DeepMocked<ExecutionContext> => {
  const context: Context = {
    req: createMock<Request>(),
    res: createMock<Response>(),
    sessionToken: {
      userId: userId || "testId",
    },
  };

  return createMock<ExecutionContext>({
    getType: jest.fn().mockReturnValue("graphql"),
    getArgs: jest.fn().mockReturnValue([null, context, null]),
  });
};

describe("last-seen interceptor", () => {
  it("handles normal requests", (done) => {
    expect.assertions(1);

    const interceptor = new LastSeenInterceptor(
      createMock<UserService>({
        seenUser: jest.fn(),
      }),
    );

    const completeCallback = (): void => {
      expect(true).toBeTruthy();
    };

    runInterceptor(interceptor, getExecutionContextMock(), doNothing, completeCallback, done);
  });

  it("handles only graphql requests", (done) => {
    const executionContext = createMock<ExecutionContext>({
      getType: jest.fn().mockReturnValue("http"),
    });

    const seenFunc = jest.fn();

    const interceptor = new LastSeenInterceptor(
      createMock<UserService>({
        seenUser: seenFunc,
      }),
    );

    runInterceptor(interceptor, executionContext, doNothing, doNothing, done);

    expect(seenFunc).not.toHaveBeenCalled();
  });

  it("marks the current user as seen", (done) => {
    const seenFunc = jest.fn();
    const userId = "user";

    const interceptor = new LastSeenInterceptor(
      createMock<UserService>({
        seenUser: seenFunc,
      }),
    );

    runInterceptor(interceptor, getExecutionContextMock(userId), doNothing, doNothing, done);

    expect(seenFunc).toHaveBeenCalledWith(userId);
  });
});
