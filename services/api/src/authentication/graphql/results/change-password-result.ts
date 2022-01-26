import { createUnionType } from "@nestjs/graphql";

import { ChangePasswordErrorResult } from "./change-password-error-result";
import { ChangePasswordSuccessResult } from "./change-password-success.result";

export function resolveType(
  value: ChangePasswordSuccessResult | ChangePasswordErrorResult,
): typeof ChangePasswordSuccessResult | typeof ChangePasswordErrorResult {
  if ("result" in value) {
    return ChangePasswordSuccessResult;
  }
  return ChangePasswordErrorResult;
}

export const ChangePasswordResult = createUnionType({
  name: "ChangePasswordResult",
  description: "The result of a change password operation.",
  types: () => [ChangePasswordSuccessResult, ChangePasswordErrorResult],
  resolveType,
});
