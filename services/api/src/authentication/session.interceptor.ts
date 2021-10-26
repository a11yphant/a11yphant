import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { UserService } from "@/user/user.service";

import { Context } from "./interfaces/context.interface";
import { SessionToken } from "./interfaces/session-token.interface";
import { JwtService } from "./jwt.service";

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService, private userService: UserService, private logger: Logger, private config: ConfigService) {}
  async intercept(executionContext: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    if (executionContext.getType<GqlContextType>() === "graphql") {
      const context = GqlExecutionContext.create(executionContext).getContext<Context>();
      return this.handleGql(context, next);
    } else {
      return this.handleHttp(executionContext, next);
    }
  }

  async handleGql(context: Context, next: CallHandler): Promise<Observable<any>> {
    this.logger.verbose("Handling session for gql request.");
    const sessionCookie = context.req.cookies[this.config.get<string>("cookie.name")];
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
        context.res.cookie(this.config.get<string>("cookie.name"), token, this.config.get("cookie.defaultConfig"));
      }),
    );
  }

  async handleHttp(executionContext: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    this.logger.verbose("Handling session for http request.");
    const req = executionContext.switchToHttp().getRequest<Request & { sessionToken: any }>();
    const sessionCookie = req.cookies[this.config.get<string>("cookie.name")];

    if (await this.jwtService.validateToken(sessionCookie)) {
      req.sessionToken = this.jwtService.decodeToken<SessionToken>(sessionCookie);
    }
    return next.handle();
  }
}
