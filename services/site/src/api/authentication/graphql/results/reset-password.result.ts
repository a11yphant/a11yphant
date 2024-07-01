import { createUnionType } from "@nestjs/graphql";

import { User } from "@/user/models/user.model";

import { ResetPasswordErrorResult } from "./reset-password-error.result";

export function resolveType(value: User | ResetPasswordErrorResult): typeof User | typeof ResetPasswordErrorResult {
  if ("id" in value) {
    return User;
  }

  return ResetPasswordErrorResult;
}

export const ResetPasswordResult = createUnionType({
  name: "ResetPasswordResult",
  description: "The result of a reset password operation.",
  types: () => [User, ResetPasswordErrorResult],
  resolveType,
});
