import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createConfigServiceMock } from "@tests/support/helpers";

import { OauthProfile } from "@/authentication/interfaces/oauth-profile.interface";
import { StoreService } from "@/authentication/store.service";
import { TwitterStrategy } from "@/authentication/strategies/twitter.strategy";

describe("github strategy", () => {
  const strategy = new TwitterStrategy(
    createMock<ConfigService>(
      createConfigServiceMock({
        "oauth.twitter.consumerKey": "test",
        "oauth.twitter.consumerSecret": "test",
      }),
    ),
    createMock<Logger>(),
    createMock<StoreService>(),
  );

  it("uses the display name", async () => {
    const profile: OauthProfile = {
      id: "testId",
      displayName: "A11y Phant",
      username: "a11yphant",
    };

    const done = jest.fn();

    await strategy.validate("token", "token", profile, done);

    expect(done).toBeCalledWith(null, {
      id: profile.id,
      displayName: profile.displayName,
      provider: "twitter",
    });
  });

  it("uses the username as fallback", async () => {
    const profile: OauthProfile = {
      id: "testId",
      username: "a11yphant",
    };

    const done = jest.fn();

    await strategy.validate("token", "token", profile, done);

    expect(done).toBeCalledWith(null, {
      id: profile.id,
      displayName: profile.username,
      provider: "twitter",
    });
  });
});
