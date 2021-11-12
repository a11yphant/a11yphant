import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";

import { Context } from "@/authentication/interfaces/context.interface";

import { UserService } from "./user.service";

@Injectable()
export class LastSeenInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(executionContext: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    if (executionContext.getType<GqlContextType>() != "graphql") {
      return next.handle();
    }

    const context = GqlExecutionContext.create(executionContext).getContext<Context>();
    this.userService.seenUser(context.sessionToken.userId);

    return next.handle();
  }
}
