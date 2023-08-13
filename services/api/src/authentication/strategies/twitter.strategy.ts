import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-twitter";

import { OauthProfile } from "../interfaces/oauth-profile.interface";
import { ProviderInformation } from "../interfaces/provider-information.interface";
import { StoreService } from "../store.service";

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, "twitter") {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly store: StoreService,
  ) {
    super({
      consumerKey: configService.get<string>("oauth.twitter.consumerKey"),
      consumerSecret: configService.get<string>("oauth.twitter.consumerSecret"),
      callbackURL: configService.get<string>("oauth.twitter.callbackURL"),
      store: store,
    });
  }

  async validate(
    token: string,
    tokenSecret: string,
    profile: OauthProfile,
    done: (error: Error, providerInformation: ProviderInformation) => undefined,
  ): Promise<undefined> {
    this.logger.log(`Logged in twitter user ${profile.id} with oauth.`);

    const displayName = (profile.displayName as string) || (profile.username as string);

    const providerInformation: ProviderInformation = {
      id: profile.id as string,
      displayName,
      provider: "twitter",
    };

    return done(null, providerInformation);
  }
}
