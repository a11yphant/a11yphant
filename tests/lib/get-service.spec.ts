/**
 * @jest-environment node
 */

import { useDatabase } from "@tests/support/database";
import { UserService } from "app/api/user/user.service";
import { getService } from "app/lib/get-service";

describe("get service", () => {
  useDatabase();

  it("can resolve a service", async () => {
    const service = await getService<UserService>(UserService);

    expect(service).toBeInstanceOf(UserService);
  });
});
