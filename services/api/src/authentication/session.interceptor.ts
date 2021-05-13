import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { Context } from "./context.interface";
import { JwtService } from "./jwt.service";

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService) {}
  async intercept(executionContext: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const { req, res } = GqlExecutionContext.create(executionContext).getContext<Context>();

    if (!this.isGraphqlRequest(req)) {
      return next.handle();
    }

    const sessionCookie = req.cookies["a11yphant_session"];
    if (await this.jwtService.validateToken(sessionCookie)) {
      return next.handle();
    }

    const token = await this.jwtService.createSignedToken({}, { subject: "session", expiresInSeconds: 3600 * 24 * 365 });
    return next.handle().pipe(
      tap(() => {
        res.cookie("a11yphant_session", token, { sameSite: true, secure: true, httpOnly: true });
      }),
    );
  }

  private isGraphqlRequest(req: Request): boolean {
    return req && req.originalUrl.startsWith("/graphql");
  }
}
