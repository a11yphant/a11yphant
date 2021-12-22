import { createMock } from "@golevelup/ts-jest";
import faker from "faker";

import { SessionToken } from "@/authentication/interfaces/session-token.interface";
import { MailService } from "@/mail/mail.service";
import { InputError } from "@/user/exceptions/input.error";
import { RegisterUserInput } from "@/user/inputs/register-user.input";
import { User } from "@/user/models/user.model";
import { UserResolver } from "@/user/user.resolver";
import { UserService } from "@/user/user.service";

const getUser = (props?: { id?: string; displayName?: string; authId?: string; authProvider?: string }): User => {
  return new User({
    id: faker.datatype.uuid(),
    displayName: faker.name.findName(),
    authId: faker.datatype.string(10),
    authProvider: "anonymous",
    ...props,
  });
};

function createUserResolver(partials: { userService?: Partial<UserService>; mailService?: Partial<MailService> } = {}): UserResolver {
  const userService = createMock<UserService>(partials.userService);
  const mailService = createMock<MailService>(partials.mailService);

  return new UserResolver(userService, mailService);
}

describe("user resolver", () => {
  it("returns the current user", async () => {
    const user = getUser({ authProvider: "github" });
    const findById = jest.fn().mockResolvedValue(user);

    const resolver = createUserResolver({ userService: { findById } });
    const resolvedUser = await resolver.currentUser({ userId: "uuid" });

    expect(resolvedUser).toBeTruthy();
  });

  it("returns a user by id", async () => {
    const user = getUser();
    const findById = jest.fn().mockResolvedValue(user);

    const resolver = createUserResolver({ userService: { findById } });
    const resolvedUser = await resolver.user(user.id);

    expect(resolvedUser).toBeTruthy();
    expect(findById).toHaveBeenCalledWith(user.id);
  });

  it("shows that the user is registered for github users", async () => {
    const user = getUser({ authProvider: "github" });

    const resolver = createUserResolver();
    const resolvedIsRegistered = await resolver.isRegistered(user);

    expect(resolvedIsRegistered).toBeTruthy();
  });

  it("shows that the user is not registered for anonymous users", async () => {
    const user = getUser({ authProvider: "anonymous" });

    const resolver = createUserResolver();
    const resolvedIsRegistered = await resolver.isRegistered(user);

    expect(resolvedIsRegistered).toBeFalsy();
  });

  describe("register", () => {
    it("returns the registered user", async () => {
      const id = "test_id";
      const user = getUser({ id, authProvider: "local" });
      const registerUser = jest.fn().mockResolvedValue(user);

      const registerUserInput: RegisterUserInput = { email: "test", password: "test" };
      const sessionToken: SessionToken = { userId: "test" };

      const resolver = createUserResolver({ userService: { registerUser } });
      const resolvedUser = await resolver.register(registerUserInput, sessionToken);

      expect(resolvedUser).toBeTruthy();
      expect(registerUser).toHaveBeenCalledWith(registerUserInput, sessionToken.userId);
    });

    it("sends an registration email if a user is registered.", async () => {
      const sendRegistrationMail = jest.fn();

      const user = getUser();

      const resolver = createUserResolver({
        userService: { registerUser: jest.fn().mockResolvedValue(user) },
        mailService: { sendRegistrationMail },
      });
      await resolver.register({ email: "test", password: "test" }, { userId: "test" });

      expect(sendRegistrationMail).toHaveBeenCalledWith(user);
    });

    it("throws an input error if the service throws an error", () => {
      const registerUser = jest.fn().mockRejectedValue(new Error());
      const registerUserInput: RegisterUserInput = { email: "test", password: "test" };
      const sessionToken: SessionToken = { userId: "test" };

      const resolver = createUserResolver({ userService: { registerUser } });
      expect(resolver.register(registerUserInput, sessionToken)).rejects.toThrow(InputError);
    });
  });
});
