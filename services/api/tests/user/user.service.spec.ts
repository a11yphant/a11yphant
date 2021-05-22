import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { UserService } from "@/user/user.service";

describe("user service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  it("can create a user", async () => {
    const prisma = getPrismaService();
    const service = new UserService(prisma);

    expect(await service.create()).toHaveProperty("id", expect.any(String));
  });
});
