import { createMock } from "@golevelup/ts-jest";
import { UserFactory } from "@tests/support/factories/models/user.factory";

import { AuthenticationService } from "@/authentication/authentication.service";
import { ResendEmailConfirmationResultEnum } from "@/authentication/enums/resend-email-confirmation-result.enum";
import { InvalidJwtException } from "@/authentication/exceptions/invalid-jwt.exception";
import { UserNotFoundException } from "@/authentication/exceptions/user-not-found.exception";
import { HashService } from "@/authentication/hash.service";
import { JwtService } from "@/authentication/jwt.service";
import { MailService } from "@/mail/mail.service";
import { UserService } from "@/user/user.service";

const userId = "userId";

function createAuthenticationService(
  partials: {
    userService?: Partial<UserService>;
    hashService?: Partial<HashService>;
    jwtService?: Partial<JwtService>;
    mailService?: Partial<MailService>;
  } = {},
): AuthenticationService {
  const userService = createMock<UserService>({
    findByEmail: jest.fn().mockResolvedValue(UserFactory.build()),
    ...partials.userService,
  });

  const hashService = createMock<HashService>({
    compare: jest.fn().mockResolvedValue(false),
    ...partials.hashService,
  });

  const jwtService = createMock<JwtService>({
    validateToken: jest.fn().mockResolvedValue(true),
    decodeToken: jest.fn().mockReturnValue({ sub: userId, exp: Number.MAX_SAFE_INTEGER }),
    ...partials.jwtService,
  });

  const mailService = createMock<MailService>({
    sendRegistrationMail: jest.fn().mockResolvedValue(null),
    ...partials.mailService,
  });

  return new AuthenticationService(userService, hashService, jwtService, mailService);
}

describe("authentication service", () => {
  const errorMessage = "E-Mail or password wrong.";

  describe("login", () => {
    it("can log in an user", async () => {
      const email = "hello@a11yphant.com";

      const service = createAuthenticationService({
        userService: {
          findByEmail: jest.fn().mockResolvedValue(UserFactory.build({ email })),
        },
        hashService: {
          compare: jest.fn().mockResolvedValue(true),
        },
      });

      const loggedInUser = await service.login({ email: "hello@a11yphant.com", password: "test_pw" });
      expect(loggedInUser.email).toBe(email);
    });

    it("throws an error if the e-mail is not found", async () => {
      const service = createAuthenticationService({
        userService: {
          findByEmail: jest.fn().mockResolvedValue(null),
        },
      });

      await expect(service.login({ email: "test_mail", password: "test_pw" })).rejects.toThrowError(errorMessage);
    });

    it("throws an error if the password is wrong", async () => {
      const service = createAuthenticationService({
        hashService: {
          compare: jest.fn().mockResolvedValue(false),
        },
      });

      await expect(service.login({ email: "mail@example.com", password: "test_pw" })).rejects.toThrowError(errorMessage);
    });
  });

  describe("validate password reset token", () => {
    it("returns valid for valid tokens", async () => {
      const service = createAuthenticationService();

      expect(await service.validatePasswordResetToken("valid_token")).toBe(true);
    });

    it("returns invalid jwt if the jwt is invalid", async () => {
      const service = createAuthenticationService({
        jwtService: {
          validateToken: jest.fn().mockResolvedValue(false),
        },
      });

      await expect(service.validatePasswordResetToken("invalid_token")).rejects.toThrow(InvalidJwtException);
    });

    it("returns unknown user if the embedded email cannot be found", async () => {
      expect.assertions(2);

      const findById = jest.fn().mockResolvedValue(null);
      const service = createAuthenticationService({
        userService: {
          findById,
        },
      });

      const validationPromise = service.validatePasswordResetToken("valid_token");
      await expect(validationPromise).rejects.toThrow(UserNotFoundException);

      validationPromise.catch(() => {
        expect(findById).toHaveBeenCalledWith(userId);
      });
    });
  });

  describe("reset password", () => {
    it("can reset the password", async () => {
      const password = "password";
      const updatePassword = jest.fn();
      const service = createAuthenticationService({
        userService: {
          updatePassword,
        },
      });

      await service.resetPassword("valid_token", password);

      expect(updatePassword).toHaveBeenCalledWith(userId, password);
    });

    it("fails resetting the password if the token is not valid", async () => {
      const service = createAuthenticationService({
        jwtService: {
          validateToken: jest.fn().mockResolvedValue(false),
        },
      });

      await expect(service.resetPassword("invalid_token", "password")).rejects.toThrow(InvalidJwtException);
    });
  });

  describe("generateMailConfirmationToken", () => {
    it("calls the jwt generation", async () => {
      const createSignedToken = jest.fn().mockResolvedValue("token");
      const service = createAuthenticationService({ jwtService: { createSignedToken } });

      await service.generateMailConfirmationToken("user");

      expect(createSignedToken).toHaveBeenCalled();
    });
  });

  describe("request password reset", () => {
    it("can request a password reset", () => {
      expect.assertions(1);
      const service = createAuthenticationService();

      expect(service.requestPasswordReset("info@a11yphant.com")).resolves.toBeUndefined();
    });

    it("sends a password reset mail to the provided email", async () => {
      const user = UserFactory.build({ email: "info@a11yphant.com" });
      const token = "token";
      const sendPasswordResetMail = jest.fn();

      const service = createAuthenticationService({
        mailService: {
          sendPasswordResetMail,
        },
        userService: {
          findByEmail: jest.fn().mockResolvedValue(user),
        },
        jwtService: {
          createSignedToken: jest.fn().mockResolvedValue(token),
        },
      });

      await service.requestPasswordReset(user.email);

      expect(sendPasswordResetMail).toHaveBeenCalledWith({
        email: user.email,
        token,
      });
    });

    it("does not send a mail if the user is not found", async () => {
      const sendPasswordResetMail = jest.fn();
      const service = createAuthenticationService({
        mailService: {
          sendPasswordResetMail,
        },
        userService: {
          findByEmail: jest.fn().mockResolvedValue(null),
        },
      });

      await service.requestPasswordReset("unknown@email.com");

      expect(sendPasswordResetMail).not.toHaveBeenCalled();
    });
  });

  describe("resend confirmation email", () => {
    const email = "hello@a11yphant.com";

    it("returns SUCCESSFUL if user exists, is not verified yet and has authProvider = local", async () => {
      const service = createAuthenticationService({
        userService: {
          findById: jest.fn().mockResolvedValue(UserFactory.build({ id: userId, email, authProvider: "local", verifiedAt: undefined })),
        },
      });

      const result = await service.resendConfirmationEmail(userId);
      expect(result).toBe(ResendEmailConfirmationResultEnum.SUCCESSFUL);
    });

    it("returns ALREADY_VERIFIED if user is already verified", async () => {
      const service = createAuthenticationService({
        userService: {
          findById: jest.fn().mockResolvedValue(UserFactory.build({ id: userId, email, authProvider: "local", verifiedAt: new Date() })),
        },
      });

      const result = await service.resendConfirmationEmail(userId);
      expect(result).toBe(ResendEmailConfirmationResultEnum.ALREADY_VERIFIED);
    });

    it("returns NOT_APPLICABLE if user has authProvider !== local", async () => {
      const service = createAuthenticationService({
        userService: {
          findById: jest.fn().mockResolvedValue(UserFactory.build({ id: userId, email, authProvider: "github", verifiedAt: undefined })),
        },
      });

      const result = await service.resendConfirmationEmail(userId);
      expect(result).toBe(ResendEmailConfirmationResultEnum.NOT_APPLICABLE);
    });

    it("returns NOT_APPLICABLE if user has no email", async () => {
      const service = createAuthenticationService({
        userService: {
          findById: jest.fn().mockResolvedValue(UserFactory.build({ id: userId, email: undefined, authProvider: "local", verifiedAt: undefined })),
        },
      });

      const result = await service.resendConfirmationEmail(userId);
      expect(result).toBe(ResendEmailConfirmationResultEnum.NOT_APPLICABLE);
    });

    it("throws UserNotFoundException if user does not exist", async () => {
      const service = createAuthenticationService({
        userService: {
          findById: jest.fn().mockResolvedValue(undefined),
        },
      });

      await expect(service.resendConfirmationEmail("invalid_token")).rejects.toThrow(UserNotFoundException);
    });
  });
});
