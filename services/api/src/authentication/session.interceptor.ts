import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { Context } from "./context.interface";
import { JwtService } from "./jwt.service";
import { SessionToken } from "./session-token.interface";

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService) {}
  async intercept(executionContext: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const context = GqlExecutionContext.create(executionContext).getContext<Context>();

    if (!this.isGraphqlRequest(context.req)) {
      return next.handle();
    }

    const sessionCookie = context.req.cookies["a11yphant_session"];
    if (await this.jwtService.validateToken(sessionCookie)) {
      context.sessionToken = this.jwtService.decodeToken<SessionToken>(sessionCookie);
      return next.handle();
    }

    const sessionToken: SessionToken = {
      userId: null,
    };

    context.sessionToken = sessionToken;
    const token = await this.jwtService.createSignedToken(sessionToken, { subject: "session", expiresInSeconds: 3600 * 24 * 365 });
    return next.handle().pipe(
      tap(() => {
        context.res.cookie("a11yphant_session", token, { sameSite: true, secure: true, httpOnly: true });
      }),
    );
  }

  private isGraphqlRequest(req: Request): boolean {
    return req && req.originalUrl.startsWith("/graphql");
  }
}
