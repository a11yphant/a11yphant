import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { Context } from "./context.interface";

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  async intercept(executionContext: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const { req, res } = GqlExecutionContext.create(executionContext).getContext<Context>();

    if (!this.isGraphqlRequest(req)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        res.cookie("a11yphant_session", "", { sameSite: true, secure: true, httpOnly: true });
      }),
    );
  }

  private isGraphqlRequest(req: Request): boolean {
    return req && req.originalUrl.startsWith("/graphql");
  }
}
