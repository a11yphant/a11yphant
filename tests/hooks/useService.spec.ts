/**
 * @jest-environment node
 */

import { useDatabase } from "@tests/support/database";
import { UserService } from "app/api/user/user.service";
import { useService } from "app/hooks/useService";

describe("use service", () => {
  useDatabase();

  it("can resolve a service", async () => {
    const service = await useService<UserService>(UserService);

    expect(service).toBeInstanceOf(UserService);
  });
});
