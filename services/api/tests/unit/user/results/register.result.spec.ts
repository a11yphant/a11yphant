import { User } from "@/user/models/user.model";
import { resolveType } from "@/user/results/register.result";
import { RegisterErrorResult } from "@/user/results/register-error.result";

describe("register result", () => {
  it("resolves to a user on success", () => {
    expect(resolveType({ id: "uuid" } as User)).toBe(User);
  });

  it("resolves to an error result on error", () => {
    expect(resolveType({} as RegisterErrorResult)).toBe(RegisterErrorResult);
  });
});
