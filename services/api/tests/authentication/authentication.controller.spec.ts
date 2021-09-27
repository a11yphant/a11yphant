import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { Request, Response } from "express";

import { AuthenticationController } from "@/authentication/authentication.controller";
import { ProviderInformation } from "@/authentication/interfaces/providerInformation.interface";
import { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { JwtService } from "@/authentication/jwt.service";
import { User } from "@/user/models/user.model";
import { UserService } from "@/user/user.service";

describe("authentication controller", () => {
  const userId = "testUserid";
  const testToken = "testTokenString";

  const authController = new AuthenticationController(
    createMock<UserService>({
      updateWithAuthInformation: jest.fn().mockResolvedValue(
        new User({
          id: userId,
          authId: "12345",
          authProvider: "github",
          displayName: "anon",
        }),
      ),
    }),
    createMock<JwtService>({
      createSignedToken: jest.fn().mockResolvedValue(testToken),
    }),
    createMock<Logger>(),
  );

  it("sets the correct cookie", async () => {
    let cookie: { name: string; token: string; options: Record<string, unknown> };

    const req = createMock<Request & { user: ProviderInformation; sessionToken: SessionTokenInterface }>();
    const res = createMock<Response>({
      cookie: jest.fn().mockImplementation((name: string, token: string, options: Record<string, unknown>) => {
        cookie = {
          name,
          token,
          options,
        };
      }),
    });

    await authController.createOauthCookie(req, res);

    expect(cookie.name).toBe("a11yphant_session");
    expect(cookie.token).toBe(testToken);
  });

  describe("github", () => {
    it("calls the inital function", () => {
      expect(authController.github()).toBeFalsy();
    });

    it("resolves the callback function", async () => {
      const req = createMock<Request & { user: ProviderInformation; sessionToken: SessionTokenInterface }>();
      const res = createMock<Response>();

      await authController.githubCallback(req, res);

      expect(res.cookie).toBeCalled();
      expect(res.redirect).toBeCalled();
    });
  });
});
