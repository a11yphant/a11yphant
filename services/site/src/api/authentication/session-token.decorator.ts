import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { Context } from "./interfaces/context.interface";

export const SessionToken = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return GqlExecutionContext.create(context).getContext<Context>().sessionToken;
});
