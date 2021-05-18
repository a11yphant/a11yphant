import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";

import { Context } from "@/authentication/context.interface";
import { SessionToken } from "@/authentication/session-token.decorator";
import { SessionToken as SessionTokenInterface } from "@/authentication/session-token.interface";

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
      getArgs: jest.fn().mockReturnValue([null, null, context]),
    });

    const result = factory(null, executionContext);

    expect(result).toEqual(sessionToken);
  });
});
