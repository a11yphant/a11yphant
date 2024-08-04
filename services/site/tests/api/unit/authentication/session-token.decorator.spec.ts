import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";

import { Context } from "@/authentication/interfaces/context.interface";
import type { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { SessionToken } from "@/authentication/session-token.decorator";

// source: https://github.com/nestjs/nest/issues/1020
function getParamDecoratorFactory(decorator: Function): any {
  class Test {
    public test(@decorator() value): any {
      // not needed
    }
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, "test");
  return args[Object.keys(args)[0]].factory;
}

describe("session token decorator", () => {
  it("returns the session token from the graphql context", () => {
    const factory = getParamDecoratorFactory(SessionToken);

    const sessionToken: SessionTokenInterface = {
      userId: "uuid",
    };

    const context = createMock<Context>({
      sessionToken,
    });

    const executionContext = createMock<ExecutionContext>({
      getArgs: jest.fn().mockReturnValue([null, context, null]),
    });

    const result = factory(null, executionContext);

    expect(result).toEqual(sessionToken);
  });
});
