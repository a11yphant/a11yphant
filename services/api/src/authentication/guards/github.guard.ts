import { Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GithubAuthGuard extends AuthGuard("github") {
  constructor(private readonly logger: Logger) {
    super();
  }

  handleRequest(err: unknown, user: unknown, info: { message?: string }): any {
    if (err || !user) {
      this.logger.warn(err || info.message);
      return user;
    }

    return user;
  }
}
