/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { Factory, USER, UserData } from "@tests/support/factories/database";
import { useDatabase } from "@tests/support/helpers";

describe("user factory", () => {
  const { getPrismaService } = useDatabase(createMock<Logger>());

  it("can create a user record with default options", async () => {
    const prisma = getPrismaService();

    const user = await prisma.user.create({
      data: Factory.build<UserData>(USER),
    });

    expect(user).toBeTruthy();
  });
});
