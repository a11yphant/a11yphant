import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";

import { OauthProfile } from "../interfaces/oauth-profile.interface";
import { ProviderInformation } from "../interfaces/provider-information.interface";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    super({
      clientID: configService.get<string>("oauth.github.clientID"),
      clientSecret: configService.get<string>("oauth.github.clientSecret"),
      callbackURL: configService.get<string>("oauth.github.callbackURL"),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: OauthProfile,
    done: (error: Error, providerInformation: ProviderInformation) => undefined,
  ): Promise<undefined> {
    this.logger.log(`Logged in github user ${profile.id} with oauth.`);

    const displayName = (profile.displayName as string) || (profile.username as string);

    const providerInformation: ProviderInformation = {
      id: profile.id as string,
      displayName,
      provider: "github",
    };

    return done(null, providerInformation);
  }
}
