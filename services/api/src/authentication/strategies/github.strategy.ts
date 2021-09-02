import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(private readonly configService: ConfigService, private readonly logger: Logger) {
    super({
      clientID: configService.get<string>("oauth.github.clientID"),
      clientSecret: configService.get<string>("oauth.github.clientSecret"),
      callbackURL: configService.get<string>("oauth.github.callbackURL"),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Record<string, unknown>,
    done: (error: Error, profile: Record<string, unknown>) => undefined,
  ): Promise<undefined> {
    this.logger.log(`Logged in github user ${profile.id} with oauth.`);
    return done(null, profile);
  }
}
