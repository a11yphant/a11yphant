import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { UserService } from "@/user/user.service";

import { JwtScope } from "./enums/jwt-scope.enum";
import { Context } from "./interfaces/context.interface";
import { JwtSessionCookie } from "./interfaces/jwt-session-cookie.interface";
import { SessionToken } from "./interfaces/session-token.interface";
import { JwtService } from "./jwt.service";

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private logger: Logger,
    private config: ConfigService,
  ) {}
  async intercept(executionContext: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    if (executionContext.getType<GqlContextType>() === "graphql") {
      const context = GqlExecutionContext.create(executionContext).getContext<Context>();
      return this.handleGql(context, next);
    } else {
      return this.handleHttp(executionContext, next);
    }
  }

  async handleGql(context: Context, next: CallHandler): Promise<Observable<any>> {
    const sessionCookie = context.req.cookies[this.config.get<string>("cookie.name")];
    const { sub: userId } = this.jwtService.decodeToken<JwtSessionCookie>(sessionCookie) || {};

    if ((await this.jwtService.validateToken(sessionCookie, JwtScope.SESSION)) && (await this.userService.findById(userId))) {
      context.sessionToken = { userId };
      return next.handle();
    }

    const user = await this.userService.create();

    const newToken: SessionToken = {
      userId: user.id,
    };

    context.sessionToken = newToken;

    const token = await this.jwtService.createSignedToken(
      { scope: JwtScope.SESSION },
      { subject: newToken.userId, expiresInSeconds: 3600 * 24 * 365 },
    );
    return next.handle().pipe(
      tap(() => {
        context.res.cookie(this.config.get<string>("cookie.name"), token, this.config.get("cookie.defaultConfig"));
      }),
    );
  }

  async handleHttp(executionContext: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = executionContext.switchToHttp().getRequest<Request & { sessionToken: any }>();
    const sessionCookie = req.cookies[this.config.get<string>("cookie.name")];

    if (await this.jwtService.validateToken(sessionCookie, JwtScope.SESSION)) {
      const { sub: userId } = this.jwtService.decodeToken<JwtSessionCookie>(sessionCookie);
      req.sessionToken = { userId };
    }
    return next.handle();
  }
}
