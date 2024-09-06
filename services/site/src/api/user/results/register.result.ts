import { createUnionType } from "@nestjs/graphql";

import { User } from "../models/user.model";
import { RegisterErrorResult } from "./register-error.result";

export function resolveType(value: User | RegisterErrorResult): typeof User | typeof RegisterErrorResult {
  if ("id" in value) {
    return User;
  }

  return RegisterErrorResult;
}

export const RegisterResult = createUnionType({
  name: "RegisterResult",
  description: "The result of a register operation.",
  types: () => [User, RegisterErrorResult],
  resolveType,
});
