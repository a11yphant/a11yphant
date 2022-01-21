import { createUnionType } from "@nestjs/graphql";

import { ChangePasswordErrorResult } from "./change-password-error-result";

export function resolveType(value: Boolean | ChangePasswordErrorResult): typeof Boolean | typeof ChangePasswordErrorResult {
  // if ("errorCode" in value) {
  //   return Boolean;
  // }
  if (value instanceof Boolean) {
    return Boolean;
  }

  return ChangePasswordErrorResult;
}

export const ChangePasswordResult = createUnionType({
  name: "ChangePasswordResult",
  description: "The result of a change password operation.",
  types: () => [Boolean, ChangePasswordErrorResult],
  resolveType,
});
