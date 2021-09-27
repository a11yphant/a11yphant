import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";
import faker from "faker";

import { UserService } from "@/user/user.service";

describe("user service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  it("can create a user", async () => {
    const prisma = getPrismaService();
    const service = new UserService(prisma);

    expect(await service.create()).toHaveProperty("id", expect.any(String));
  });

  it("can find a user by id", async () => {
    const prisma = getPrismaService();
    const service = new UserService(prisma);

    const user = await service.create();

    expect(await service.findById(user.id)).toHaveProperty("id", user.id);
  });

  it("returns null if it cannot find the user by id", async () => {
    const prisma = getPrismaService();
    const service = new UserService(prisma);

    expect(await service.findById(faker.datatype.uuid())).toBeNull();
  });
});
