import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { Observable } from "rxjs";

import { UserService } from "@/user/user.service";

import { Context } from "./interfaces/context.interface";
import { JwtSessionCookie } from "./interfaces/jwt-session-cookie.interface";
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

    // token was already verified in the middleware
    const { sub: userId } = this.jwtService.decodeToken<JwtSessionCookie>(sessionCookie) || {};

    await this.userService.createIfNotExists(userId);

    context.sessionToken = { userId };

    return next.handle();
  }

  async handleHttp(executionContext: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = executionContext.switchToHttp().getRequest<Request & { sessionToken: any }>();
    const sessionCookie = req.cookies[this.config.get<string>("cookie.name")];

    const { sub: userId } = this.jwtService.decodeToken<JwtSessionCookie>(sessionCookie);
    req.sessionToken = { userId };

    return next.handle();
  }
}
