import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-twitter";

import { ProviderInformation } from "../interfaces/providerInformation.interface";
import { StoreService } from "../store.service";

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, "twitter") {
  constructor(private readonly configService: ConfigService, private readonly logger: Logger, private readonly store: StoreService) {
    super({
      // requestTokenURL: "https://api.twitter.com/oauth/request_token",
      // accessTokenURL: "https://api.twitter.com/oauth/access_token",
      // userAuthorizationURL: "https://api.twitter.com/oauth/authorize",
      consumerKey: "7ttDKVhrdJoj97W28mAejbKqv",
      consumerSecret: "g1xpBubdIZ67a3TuNwJeOIfUNCR9bYMvdzYizMWVLGsjdZRrBb",
      callbackURL: "http://localhost:3000/auth/twitter/callback",
      store: store,
    });
  }

  async validate(
    token: string,
    tokenSecret: string,
    profile: Record<string, unknown>,
    done: (error: Error, providerInformation: ProviderInformation) => undefined,
  ): Promise<undefined> {
    this.logger.log(`Logged in twitter user ${profile.id} with oauth.`);

    const providerInformation: ProviderInformation = {
      id: profile.id as string,
      displayName: profile.displayName as string,
      provider: "twitter",
    };

    console.log(providerInformation);

    return done(null, providerInformation);
  }
}
