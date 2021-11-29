import { createMock } from "@golevelup/ts-jest";
import faker from "faker";

import { MailService } from "@/mail/mail.service";
import { InputError } from "@/user/exceptions/input.error";
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

describe("user resolver", () => {
  it("returns the current user", () => {
    const user = getUser({ authProvider: "github" });

    const resolver = new UserResolver(
      createMock<UserService>({
        findById: jest.fn().mockResolvedValue(user),
      }),
      createMock<MailService>(),
    );

    expect(resolver.currentUser({ userId: "uuid" })).resolves.toHaveProperty("id", user.id);
  });

  it("returns a user by id", () => {
    const user = getUser();

    const resolver = new UserResolver(
      createMock<UserService>({
        findById: jest.fn().mockResolvedValue(user),
      }),
      createMock<MailService>(),
    );

    expect(resolver.user(user.id)).resolves.toHaveProperty("id", user.id);
  });

  it("shows that the user is registered for gitlab users", () => {
    const user = getUser({ authProvider: "github" });

    const resolver = new UserResolver(createMock<UserService>(), createMock<MailService>());

    expect(resolver.isRegistered(user)).toBeTruthy();
  });

  it("shows that the user is not registered for anonymous users", () => {
    const user = getUser({ authProvider: "anonymous" });

    const resolver = new UserResolver(createMock<UserService>(), createMock<MailService>());

    expect(resolver.isRegistered(user)).toBeFalsy();
  });

  describe("register", () => {
    it("returns the registered user", async () => {
      const id = "test_id";

      const user = getUser({ id, authProvider: "local" });

      const resolver = new UserResolver(
        createMock<UserService>({
          registerUser: jest.fn().mockResolvedValue(user),
        }),
        createMock<MailService>(),
      );

      const { id: userId } = await resolver.register({ email: "test", password: "test" }, { userId: "test" });

      expect(userId).toBe(id);
    });

    it("throws an input error if the service throws an error", () => {
      const resolver = new UserResolver(
        createMock<UserService>({
          registerUser: jest.fn().mockRejectedValue(new Error()),
        }),
        createMock<MailService>(),
      );

      expect(resolver.register({ email: "test", password: "test" }, { userId: "test" })).rejects.toThrow(InputError);
    });
  });
});
