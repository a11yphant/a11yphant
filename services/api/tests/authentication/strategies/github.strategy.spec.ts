import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { OauthProfile } from "@/authentication/interfaces/oauth-profile.interface";
import { GithubStrategy } from "@/authentication/strategies/github.strategy";

describe("github strategy", () => {
  const strategy = new GithubStrategy(createMock<ConfigService>(), createMock<Logger>());

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
      provider: "github",
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
      provider: "github",
    });
  });
});
