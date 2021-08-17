import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { useDatabase } from "@tests/helpers";

import { USER } from "./constants";
import { Factory } from "./factory";
import { UserData } from "./types";

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
