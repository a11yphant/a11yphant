import { createUnionType } from "@nestjs/graphql";

import { User } from "@/user/models/user.model";

import { ResetPasswordErrorResult } from "./reset-password-error.result";

export const ResetPasswordResult = createUnionType({
  name: "ResetPasswordResult",
  description: "The result of a reset password operation.",
  types: () => [User, ResetPasswordErrorResult],
  resolveType: (value: User & ResetPasswordErrorResult) => {
    if (value.id) {
      return User;
    }

    return ResetPasswordErrorResult;
  },
});
