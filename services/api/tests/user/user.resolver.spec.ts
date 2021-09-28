import { createMock } from "@golevelup/ts-jest";
import faker from "faker";

import { User } from "@/user/models/user.model";
import { UserResolver } from "@/user/user.resolver";
import { UserService } from "@/user/user.service";

describe("user resolver", () => {
  it("returns the current user", () => {
    const user = new User({
      id: faker.datatype.uuid(),
      displayName: faker.name.findName(),
      authId: faker.datatype.string(10),
      authProvider: "github",
    });

    const resolver = new UserResolver(
      createMock<UserService>({
        findById: jest.fn().mockResolvedValue(user),
      }),
    );

    expect(resolver.currentUser({ userId: "uuid" })).resolves.toHaveProperty("id", user.id);
  });

  it("shows that the user is registered for gitlab users", () => {
    const user = new User({
      id: faker.datatype.uuid(),
      displayName: faker.name.findName(),
      authId: faker.datatype.string(10),
      authProvider: "github",
    });

    const resolver = new UserResolver(createMock<UserService>());

    expect(resolver.isRegistered(user)).toBeTruthy();
  });

  it("shows that the user is not registered for anonymous users", () => {
    const user = new User({
      id: faker.datatype.uuid(),
      displayName: faker.name.findName(),
      authId: faker.datatype.string(10),
      authProvider: "anonymous",
    });

    const resolver = new UserResolver(createMock<UserService>());

    expect(resolver.isRegistered(user)).toBeFalsy();
  });
});
