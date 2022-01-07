import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createConfigServiceMock } from "@tests/support/helpers";
import { Request, Response } from "express";

import { AuthenticationController } from "@/authentication/authentication.controller";
import { FlashMessage } from "@/authentication/enums/flash-message.enum";
import { ProviderInformation } from "@/authentication/interfaces/provider-information.interface";
import { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { JwtService } from "@/authentication/jwt.service";
import { User } from "@/user/models/user.model";
import { UserService } from "@/user/user.service";

const getAuthController = (
  partials: {
    userService?: Partial<UserService>;
    jwtService?: Partial<JwtService>;
    configData?: Record<string, any>;
  } = {},
): AuthenticationController => {
  const userService = createMock<UserService>(partials.userService);
  const jwtService = createMock<JwtService>(partials.jwtService);
  const logger = createMock<Logger>();
  const configService = createMock<ConfigService>(createConfigServiceMock(partials.configData));

  return new AuthenticationController(userService, jwtService, logger, configService);
};

describe("authentication controller", () => {
  describe("confirm", () => {
    it("successfully confirms an user", async () => {
      const redirect = jest.fn();

      const res = createMock<Response>({
        redirect,
      });

      const validateToken = jest.fn().mockResolvedValue(true);
      const decodeToken = jest.fn().mockResolvedValue({ sub: "test" });
      const confirmUser = jest.fn().mockResolvedValue(true);

      const authController = getAuthController({
        userService: {
          confirmUser,
        },
        jwtService: {
          validateToken,
          decodeToken,
        },
      });

      await authController.confirm("test", res);

      expect(validateToken).toHaveBeenCalled();
      expect(decodeToken).toHaveBeenCalled();
      expect(confirmUser).toHaveBeenCalled();

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining(FlashMessage.EMAIL_CONFIRMATION_SUCCESSFUL));
    });

    it("redirects with correct message if token is invalid", async () => {
      const redirect = jest.fn();
      const res = createMock<Response>({
        redirect,
      });

      const confirmUser = jest.fn().mockResolvedValue(true);

      const authController = getAuthController({
        userService: {
          confirmUser,
        },
        jwtService: {
          validateToken: jest.fn().mockResolvedValue(false),
        },
      });

      await authController.confirm("test", res);

      expect(confirmUser).not.toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith(expect.stringContaining(FlashMessage.EMAIL_CONFIRMATION_FAILED));
    });

    it("redirects with email confirmation failed message if update throws error", async () => {
      const redirect = jest.fn();
      const res = createMock<Response>({
        redirect,
      });

      const confirmUser = jest.fn().mockRejectedValue("Error");

      const authController = getAuthController({
        userService: {
          confirmUser,
        },
        jwtService: {
          validateToken: jest.fn().mockResolvedValue(true),
          decodeToken: jest.fn().mockResolvedValue({ sub: "test" }),
        },
      });

      await authController.confirm("test", res);

      expect(confirmUser).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith(expect.stringContaining(FlashMessage.EMAIL_CONFIRMATION_FAILED));
    });
  });

  describe("oauth", () => {
    const userId = "testUserid";
    const testToken = "testTokenString";

    const authController = getAuthController({
      userService: {
        updateWithAuthInformation: jest.fn().mockResolvedValue(
          new User({
            id: userId,
            authId: "12345",
            authProvider: "github",
            displayName: "anon",
          }),
        ),
      },
      jwtService: {
        createSignedToken: jest.fn().mockResolvedValue(testToken),
      },
    });

    describe("createOauthCookie", () => {
      it("sets the configured cookie", async () => {
        let cookie: { name: string; token: string; options: Record<string, unknown> };

        const req = createMock<Request & { user: ProviderInformation; sessionToken: SessionTokenInterface }>({
          sessionToken: {
            userId,
          },
        });
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
    });

    describe("github", () => {
      it("calls the initial function", () => {
        expect(authController.github()).toBeFalsy();
      });

      it("sets the the auth cookie and redirects", async () => {
        const req = createMock<Request & { user: ProviderInformation; sessionToken: SessionTokenInterface }>({
          sessionToken: {
            userId,
          },
        });
        const res = createMock<Response>();

        await authController.githubCallback(req, res);

        expect(res.cookie).toBeCalled();
        expect(res.redirect).toBeCalled();
      });
    });

    describe("twitter", () => {
      it("calls the initial function", () => {
        expect(authController.twitter()).toBeFalsy();
      });

      it("sets the the auth cookie and redirects", async () => {
        const req = createMock<Request & { user: ProviderInformation; sessionToken: SessionTokenInterface }>({
          sessionToken: {
            userId,
          },
        });
        const res = createMock<Response>();

        await authController.twitterCallback(req, res);

        expect(res.cookie).toBeCalled();
        expect(res.redirect).toBeCalled();
      });
    });
  });
});
