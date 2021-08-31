import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { UserService } from "@/user/user.service";

import { Context } from "./interfaces/context.interface";
import { SessionToken } from "./interfaces/session-token.interface";
import { JwtService } from "./jwt.service";

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService, private userService: UserService) {}
  async intercept(executionContext: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    if (executionContext.getType<GqlContextType>() !== "graphql") {
      return next.handle();
    }

    const context = GqlExecutionContext.create(executionContext).getContext<Context>();

    const sessionCookie = context.req.cookies["a11yphant_session"];
    if (await this.jwtService.validateToken(sessionCookie)) {
      context.sessionToken = this.jwtService.decodeToken<SessionToken>(sessionCookie);
      return next.handle();
    }

    const user = await this.userService.create();

    const sessionToken: SessionToken = {
      userId: user.id,
    };

    context.sessionToken = sessionToken;
    const token = await this.jwtService.createSignedToken(sessionToken, { subject: "session", expiresInSeconds: 3600 * 24 * 365 });
    return next.handle().pipe(
      tap(() => {
        context.res.cookie("a11yphant_session", token, { sameSite: true, secure: true, httpOnly: true });
      }),
    );
  }
}
