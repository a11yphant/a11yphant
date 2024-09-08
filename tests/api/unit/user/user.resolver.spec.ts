import { createMock } from "@golevelup/ts-jest";
import { UserFactory } from "@tests/support/factories/models/user.factory";

import { AuthenticationService } from "@/authentication/authentication.service";
import { SessionToken } from "@/authentication/interfaces/session-token.interface";
import { MailService } from "@/mail/mail.service";
import { RegisterErrorCodes } from "@/user/enums/register-error-codes.enum";
import { AnonymousUserInvalidError } from "@/user/exceptions/anonymous-user-invalid.error";
import { RegisterUserInput } from "@/user/inputs/register-user.input";
import { RegisterErrorResult } from "@/user/results/register-error.result";
import { UserResolver } from "@/user/user.resolver";
import { UserService } from "@/user/user.service";

function createUserResolver(
  partials: { userService?: Partial<UserService>; authenticationService?: Partial<AuthenticationService>; mailService?: Partial<MailService> } = {},
): UserResolver {
  const userService = createMock<UserService>({
    ...partials.userService,
  });

  const authenticationService = createMock<AuthenticationService>({
    ...partials.authenticationService,
  });

  const mailService = createMock<MailService>({ ...partials.mailService });

  return new UserResolver(userService, authenticationService, mailService);
}

describe("user resolver", () => {
  it("returns the current user", async () => {
    const user = UserFactory.build({ authProvider: "github" });
    const findById = jest.fn().mockResolvedValue(user);

    const resolver = createUserResolver({ userService: { findById } });
    const resolvedUser = await resolver.currentUser({ userId: "uuid" });

    expect(resolvedUser).toBeTruthy();
  });

  it("returns a user by id", async () => {
    const user = UserFactory.build();
    const findById = jest.fn().mockResolvedValue(user);

    const resolver = createUserResolver({ userService: { findById } });
    const resolvedUser = await resolver.user(user.id);

    expect(resolvedUser).toBeTruthy();
    expect(findById).toHaveBeenCalledWith(user.id);
  });

  describe("is verified", () => {
    it("returns true for local users with a verified email", () => {
      const user = UserFactory.build({ authProvider: "local", verifiedAt: new Date() });

      const resolver = createUserResolver();
      const verified = resolver.isVerified(user);

      expect(verified).toBeTruthy();
    });

    it("returns false for local users with an unverified email", () => {
      const user = UserFactory.build({ authProvider: "local", verifiedAt: null });

      const resolver = createUserResolver();
      const verified = resolver.isVerified(user);

      expect(verified).toBeFalsy();
    });

    it("returns true for github users", () => {
      const user = UserFactory.build({ authProvider: "github" });

      const resolver = createUserResolver();
      const verified = resolver.isVerified(user);

      expect(verified).toBeTruthy();
    });

    it("returns false for anonymous users", () => {
      const user = UserFactory.build({ authProvider: "anonymous" });

      const resolver = createUserResolver();
      const verified = resolver.isVerified(user);

      expect(verified).toBeFalsy();
    });
  });

  describe("registered", () => {
    it("returns true for users registered via github", async () => {
      const user = UserFactory.build({ authProvider: "github" });

      const resolver = createUserResolver();
      const resolvedIsRegistered = await resolver.isRegistered(user);

      expect(resolvedIsRegistered).toBeTruthy();
    });

    it("returns false for anonymous users", async () => {
      const user = UserFactory.build({ authProvider: "anonymous" });

      const resolver = createUserResolver();
      const resolvedIsRegistered = await resolver.isRegistered(user);

      expect(resolvedIsRegistered).toBeFalsy();
    });
  });

  describe("register", () => {
    it("returns the registered user", async () => {
      const id = "test_id";
      const user = UserFactory.build({ id, authProvider: "local" });
      const registerUser = jest.fn().mockResolvedValue(user);

      const registerUserInput: RegisterUserInput = { email: "test", password: "test" };
      const sessionToken: SessionToken = { userId: "test" };

      const resolver = createUserResolver({ userService: { registerUser } });
      const resolvedUser = await resolver.register(registerUserInput, sessionToken);

      expect(resolvedUser).toBeTruthy();
      expect(registerUser).toHaveBeenCalledWith(registerUserInput, sessionToken.userId);
    });

    it("sends an registration e-mail if a user is registered.", async () => {
      const token = "token";
      const sendRegistrationMail = jest.fn();

      const user = UserFactory.build();

      const resolver = createUserResolver({
        userService: { registerUser: jest.fn().mockResolvedValue(user) },
        mailService: { sendRegistrationMail },
        authenticationService: { generateMailConfirmationToken: jest.fn().mockReturnValue(token) },
      });
      await resolver.register({ email: "test", password: "test" }, { userId: "test" });

      expect(sendRegistrationMail).toHaveBeenCalledWith({
        userId: user.id,
        email: user.email,
        displayName: user.displayName,
        token,
      });
    });

    it("throws an input error if the service throws an unknown error", async () => {
      const registerUser = jest.fn().mockRejectedValue(new Error());
      const registerUserInput: RegisterUserInput = { email: "test", password: "test" };
      const sessionToken: SessionToken = { userId: "test" };

      const resolver = createUserResolver({ userService: { registerUser } });
      await expect(resolver.register(registerUserInput, sessionToken)).rejects.toThrow(Error);
    });

    it("maps the thrown error correctly", async () => {
      const registerUser = jest.fn().mockRejectedValue(new AnonymousUserInvalidError());
      const registerUserInput: RegisterUserInput = { email: "test", password: "test" };
      const sessionToken: SessionToken = { userId: "test" };

      const resolver = createUserResolver({ userService: { registerUser } });
      const result = (await resolver.register(registerUserInput, sessionToken)) as RegisterErrorResult;

      expect(result.errorCode).toEqual(RegisterErrorCodes.ANONYMOUS_USER_INVALID);
    });
  });
});
