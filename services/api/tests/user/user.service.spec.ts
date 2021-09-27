import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { UserFactory } from "@tests/factories/models/user.factory";
import { useDatabase } from "@tests/helpers";
import faker from "faker";

import { ProviderInformation } from "@/authentication/interfaces/providerInformation.interface";
import { UserService } from "@/user/user.service";

describe("user service", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());
  it("can create a user", async () => {
    const prisma = getPrismaService();
    const service = new UserService(prisma);

    expect(await service.create()).toHaveProperty("id", expect.any(String));
  });

  it("adds auth information to an anonymous user", async () => {
    const prisma = getPrismaService();
    const service = new UserService(prisma);

    const user = await prisma.user.create({
      data: UserFactory.build({ displayName: null }),
    });

    const providerInformation: ProviderInformation = {
      id: faker.datatype.uuid(),
      displayName: faker.name.findName(),
      provider: "github",
    };

    await service.updateWithAuthInformation(user.id, providerInformation);

    const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(updatedUser).toHaveProperty("displayName", providerInformation.displayName);
    expect(updatedUser).toHaveProperty("authProvider", providerInformation.provider);
  });
});
